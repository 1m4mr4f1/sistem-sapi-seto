// prisma/betadata.seed.ts
import { PrismaClient, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // <--- Tambahan Import

const prisma = new PrismaClient();

async function main() {
  console.log('🥩 MEMULAI SEEDING BETA DATA (SECURE)...');
  
  // ... (Bagian Hapus Data Lama / Clean up biarkan sama seperti sebelumnya) ...
  await prisma.saleDetail.deleteMany();
  await prisma.purchaseDetail.deleteMany();
  await prisma.paymentReceivable.deleteMany();
  await prisma.paymentPayable.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // --- BAGIAN USER DIPERBARUI DENGAN HASHING ---
  console.log('👤 Membuat User dengan Password Terenkripsi...');
  
  const passwordAdmin = await bcrypt.hash('password123', 10); // Enkripsi password
  const owner = await prisma.user.create({
    data: {
      name: 'Pak Seto',
      username: 'admin',
      password: passwordAdmin, // Simpan hasil enkripsi
      role: 'admin',
    },
  });

  const passwordKasir = await bcrypt.hash('kasir123', 10); // Enkripsi password
  const kasir = await prisma.user.create({
    data: {
      name: 'Mas Joko',
      username: 'kasir',
      password: passwordKasir, // Simpan hasil enkripsi
      role: 'cashier',
    },
  });
  
  // ... (Sisa kode ke bawah untuk Supplier, Customer, Produk, Transaksi biarkan SAMA PERSIS seperti sebelumnya) ...
  // ... (Copy paste sisa kode dari file betadata.seed.ts sebelumnya di sini) ...
  
  // 3. BUAT SUPPLIER (Peternak Sapi)
  console.log('truck: Membuat Supplier...');
  const peternakA = await prisma.supplier.create({
    data: {
      supplier_name: 'Kelompok Ternak Lembu Suro (Boyolali)',
      contact: 'Pak Haji Slamet - 08123456789',
    },
  });

  const peternakB = await prisma.supplier.create({
    data: {
      supplier_name: 'Peternakan Barokah Jaya',
      contact: 'Kang Ujang - 08987654321',
    },
  });

  // 4. BUAT CUSTOMER (Pedagang/Pelanggan)
  console.log('👥 Membuat Customer...');
  const baksoPakKumis = await prisma.customer.create({
    data: {
      customer_name: 'Bakso Urat Pak Kumis',
      contact: '08111222333',
    },
  });

  const rmPadang = await prisma.customer.create({
    data: {
      customer_name: 'RM Padang Murah Rejeki',
      contact: '08555666777',
    },
  });

  // 5. BUAT PRODUK (Master Barang)
  console.log('📦 Membuat Produk Daging...');
  
  const dagingHasDalam = await prisma.product.create({
    data: {
      product_name: 'Daging Has Dalam (Tenderloin)',
      stock: 0, 
      selling_price: 140000, 
      last_purchase_price: 110000, 
    },
  });

  const dagingRawonan = await prisma.product.create({
    data: {
      product_name: 'Daging Rawonan / Tetelan',
      stock: 5,
      selling_price: 85000,
      last_purchase_price: 60000,
    },
  });

  const igaSapi = await prisma.product.create({
    data: {
      product_name: 'Iga Sapi Super',
      stock: 0,
      selling_price: 95000,
      last_purchase_price: 75000,
    },
  });

  // 6. TRANSAKSI PEMBELIAN
  const pembelian1 = await prisma.purchase.create({
    data: {
      user_id: owner.id,
      supplier_id: peternakA.id,
      purchase_date: new Date(),
      total_purchase: 18500000, 
      payment_status: PaymentStatus.paid,
      note: 'Restock Daging Segar Harian',
      purchase_details: {
        create: [
          { product_id: dagingHasDalam.id, quantity: 50, price_at_purchase: 110000 },
          { product_id: igaSapi.id, quantity: 100, price_at_purchase: 75000 },
          { product_id: dagingRawonan.id, quantity: 30, price_at_purchase: 60000 }
        ],
      },
    },
  });

  await prisma.product.update({ where: { id: dagingHasDalam.id }, data: { stock: { increment: 50 } } });
  await prisma.product.update({ where: { id: igaSapi.id }, data: { stock: { increment: 100 } } });
  await prisma.product.update({ where: { id: dagingRawonan.id }, data: { stock: { increment: 30 } } });

  // 7. TRANSAKSI PENJUALAN
  const penjualanBon = await prisma.sale.create({
    data: {
      user_id: kasir.id,
      customer_id: baksoPakKumis.id,
      sale_date: new Date(),
      subtotal: 2125000,
      discount: 25000,
      final_total: 2100000,
      payment_status: PaymentStatus.unpaid,
      note: 'Bon, janji bayar lusa',
      sale_details: {
        create: [
          { product_id: dagingRawonan.id, quantity: 25, price_at_sale: 85000 }
        ],
      },
    },
  });

  await prisma.product.update({ where: { id: dagingRawonan.id }, data: { stock: { decrement: 25 } } });

  // 8. PENGELUARAN
  await prisma.expense.create({
    data: {
      user_id: owner.id,
      expense_date: new Date(),
      expense_type: 'Operasional',
      amount: 150000,
      description: 'Beli Es Balok 5 batang',
    },
  });

  console.log('✅ SEEDING SELESAI! Database Secured.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });