import ProductForm from '@/app/components/dashboard/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
  return (
    <div>
      {/* Header Halaman */}
      <div className="mb-6">
        <Link 
          href="/dashboard/products" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Daftar Produk
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Produk Baru</h1>
        <p className="text-gray-500">Masukkan detail daging atau barang dagangan baru.</p>
      </div>

      {/* Render Form View */}
      <ProductForm />
    </div>
  );
}