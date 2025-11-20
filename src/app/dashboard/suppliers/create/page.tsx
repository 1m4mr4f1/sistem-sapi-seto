import SupplierForm from '@/app/components/dashboard/SupplierForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateSupplierPage() {
  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/suppliers" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Penyedia Baru</h1>
      </div>

      <SupplierForm />
    </div>
  );
}