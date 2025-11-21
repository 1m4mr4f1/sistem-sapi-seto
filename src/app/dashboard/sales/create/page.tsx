import { prisma } from '@/lib/prisma';
import SaleForm from '@/app/components/dashboard/SaleForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreateSalePage() {
  const [products, customers] = await Promise.all([
    prisma.product.findMany({ orderBy: { product_name: 'asc' } }),
    prisma.customer.findMany({ orderBy: { customer_name: 'asc' } })
  ]);

  const serializedProducts = products.map(p => ({
    id: String(p.id),
    product_name: p.product_name,
    stock: p.stock, // Int
    selling_price: Number(p.selling_price)
  }));

  const serializedCustomers = customers.map(c => ({
    id: String(c.id),
    customer_name: c.customer_name
  }));

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/sales" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Riwayat
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Transaksi Penjualan Baru</h1>
        <p className="text-gray-500">Masuk ke mode kasir.</p>
      </div>
      <SaleForm products={serializedProducts} customers={serializedCustomers} />
    </div>
  );
}