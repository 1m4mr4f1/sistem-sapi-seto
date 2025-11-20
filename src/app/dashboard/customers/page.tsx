import { getCustomersPaginated } from '@/app/lib/data/customer.data';
import CustomerTable from '@/app/components/dashboard/CustomerTable';
import Pagination from '@/app/components/dashboard/Pagination';
import { Plus, Users } from 'lucide-react'; // Icon Users
import Link from 'next/link';

export default async function CustomersPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  const { customers, totalCustomers, totalPages } = await getCustomersPaginated(currentPage, itemsPerPage);

  // Serialize BigInt ke String
  const serializedCustomers = customers.map((c) => ({
    id: String(c.id),
    customer_name: c.customer_name,
    contact: c.contact,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pt-2 flex items-center gap-2">
            <Users className="text-blue-600" /> Manajemen Pelanggan
          </h1>
          <p className="text-gray-500">Data pelanggan tetap dan kontak mereka.</p>
        </div>
        
        <Link
          href="/dashboard/customers/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Pelanggan</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <CustomerTable customers={serializedCustomers} />
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCustomers}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}