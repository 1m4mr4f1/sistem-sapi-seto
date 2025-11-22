import { prisma } from '@/lib/prisma';
import PurchaseForm from '@/app/components/dashboard/PurchaseForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CreatePurchasePage() {
  const [suppliers, products] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { supplier_name: 'asc' } }),
    prisma.product.findMany({ orderBy: { product_name: 'asc' } })
  ]);

  const serializedSuppliers = suppliers.map(s => ({
    id: String(s.id),
    supplier_name: s.supplier_name
  }));

  const serializedProducts = products.map(p => ({
    id: String(p.id),
    product_name: p.product_name,
    // Ambil harga beli terakhir untuk referensi
    last_purchase_price: p.last_purchase_price ? Number(p.last_purchase_price) : null
  }));

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/purchases" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Riwayat
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Input Pembelian (Kulakan)</h1>
        <p className="text-gray-500">Barang yang diinput di sini akan menambah STOK produk.</p>
      </div>

      <PurchaseForm suppliers={serializedSuppliers} products={serializedProducts} />
    </div>
  );
}