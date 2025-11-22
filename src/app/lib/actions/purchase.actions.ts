'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type CartItem = {
  productId: string;
  quantity: number;
  costPrice: number; // Harga Beli Satuan
};

export async function createPurchase(
  supplierId: string,
  date: Date,
  items: CartItem[],
  amountPaid: number,
  note: string
) {
  // 1. Validasi
  if (!supplierId) throw new Error('Supplier wajib dipilih.');
  if (!items || items.length === 0) throw new Error('Keranjang belanja kosong.');

  // 2. Hitung Total
  const totalPurchase = items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  
  // Tentukan Status Pembayaran
  // Jika bayar >= total -> Lunas (paid), jika kurang -> Hutang (unpaid)
  const paymentStatus = amountPaid >= totalPurchase ? 'paid' : 'unpaid';

  // 3. DATABASE TRANSACTION (Wajib!)
  await prisma.$transaction(async (tx) => {
    
    // A. Simpan Header Pembelian
    const purchase = await tx.purchase.create({
      data: {
        user_id: 1, // Hardcode admin sementara (sesuai seed)
        supplier_id: BigInt(supplierId),
        purchase_date: date,
        total_purchase: totalPurchase,
        payment_status: paymentStatus,
        note: note || null,
      }
    });

    // B. Loop Barang: Simpan Detail & Update Produk
    for (const item of items) {
      // Validasi Integer untuk Stok (Sesuai DB)
      if (!Number.isInteger(item.quantity)) {
        throw new Error(`Jumlah barang harus bulat (tidak boleh koma).`);
      }

      // 1. Simpan Detail Pembelian
      await tx.purchaseDetail.create({
        data: {
          purchase_id: purchase.id,
          product_id: BigInt(item.productId),
          quantity: item.quantity,
          price_at_purchase: item.costPrice
        }
      });

      // 2. UPDATE MASTER PRODUK (Penting!)
      // - Tambah Stok
      // - Update Harga Beli Terakhir (Agar HPP selalu update)
      await tx.product.update({
        where: { id: BigInt(item.productId) },
        data: {
          stock: {
            increment: item.quantity
          },
          last_purchase_price: item.costPrice 
        }
      });
    }

    // C. Catat Pembayaran Awal (Jika ada uang keluar)
    if (amountPaid > 0) {
      await tx.paymentPayable.create({
        data: {
          purchase_id: purchase.id,
          payment_date: date,
          amount_paid: amountPaid
        }
      });
    }
  });

  // 4. Redirect
  revalidatePath('/dashboard/purchases');
  revalidatePath('/dashboard/products'); // Stok di produk berubah, refresh juga
  redirect('/dashboard/purchases');
}