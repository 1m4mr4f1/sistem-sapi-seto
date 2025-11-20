import CustomerForm from '@/app/components/dashboard/CustomerForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateCustomerPage() {
  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/customers" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Pelanggan Baru</h1>
      </div>

      <CustomerForm />
    </div>
  );
}