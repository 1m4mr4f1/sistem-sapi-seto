import SupplierForm from '@/app/components/dashboard/SupplierForm';
import { getSupplierById } from '@/app/lib/data/supplier.data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditSupplierProps {
  params: {
    id: string;
  };
}

export default async function EditSupplierPage({ params }: EditSupplierProps) {
  const supplier = await getSupplierById(params.id);

  if (!supplier) {
    notFound();
  }

  const serializedSupplier = {
    id: String(supplier.id),
    supplier_name: supplier.supplier_name,
    contact: supplier.contact,
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/suppliers" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Penyedia</h1>
      </div>

      <SupplierForm initialData={serializedSupplier} />
    </div>
  );
}