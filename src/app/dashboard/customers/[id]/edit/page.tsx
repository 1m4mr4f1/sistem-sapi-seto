import CustomerForm from '@/app/components/dashboard/CustomerForm';
import { getCustomerById } from '@/app/lib/data/customer.data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditCustomerProps {
  params: {
    id: string;
  };
}

export default async function EditCustomerPage({ params }: EditCustomerProps) {
  const customer = await getCustomerById(params.id);

  if (!customer) {
    notFound();
  }

  // Serialize Data
  const serializedCustomer = {
    id: String(customer.id),
    customer_name: customer.customer_name,
    contact: customer.contact,
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/customers" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Pelanggan</h1>
      </div>

      <CustomerForm initialData={serializedCustomer} />
    </div>
  );
}