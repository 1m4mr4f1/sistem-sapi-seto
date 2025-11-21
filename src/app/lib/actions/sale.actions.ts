'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type CartItem = {
  productId: string;
  quantity: number;
  price: number;
};

export async function createSale(
  customerId: string | null,
  date: Date,
  items: CartItem[],
  discount: number,
  amountPaid: number
) {
  // 1. Validasi Dasar
  if (!items || items.length === 0) {
    throw new Error('Keranjang belanja kosong.');
  }

  // 2. Hitung Ulang Total di Server
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const finalTotal = subTotal - discount;
  
  const paymentStatus = amountPaid >= finalTotal ? 'paid' : 'unpaid';

  // 3. Transaksi Database
  await prisma.$transaction(async (tx) => {
    
    // A. Cek Stok & Validasi Integer
    for (const item of items) {
      // Validasi: Quantity harus Integer (1, 2, 3) karena DB pakai Int
      if (!Number.isInteger(item.quantity)) {
        throw new Error(`Jumlah barang harus bulat (tidak boleh koma).`);
      }

      const product = await tx.product.findUnique({
        where: { id: BigInt(item.productId) }
      });

      if (!product) throw new Error(`Produk ID ${item.productId} tidak ditemukan.`);
      
      if (product.stock < item.quantity) {
        throw new Error(`Stok ${product.product_name} tidak cukup. Sisa: ${product.stock}`);
      }
    }

    // B. Simpan Header Penjualan
    // Note: user_id hardcoded ke 1 (Admin) sementara karena belum ada session auth
    const sale = await tx.sale.create({
      data: {
        user_id: 1, 
        customer_id: customerId ? BigInt(customerId) : null,
        sale_date: date,
        subtotal: subTotal,
        discount: discount,
        final_total: finalTotal,
        payment_status: paymentStatus,
        note: amountPaid < finalTotal ? `Kurang bayar: ${finalTotal - amountPaid}` : 'Lunas',
      }
    });

    // C. Simpan Detail & Update Stok
    for (const item of items) {
      await tx.saleDetail.create({
        data: {
          sale_id: sale.id,
          product_id: BigInt(item.productId),
          quantity: item.quantity,
          price_at_sale: item.price
        }
      });

      await tx.product.update({
        where: { id: BigInt(item.productId) },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
  });

  // 4. Redirect
  revalidatePath('/dashboard/sales');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/sales');
}