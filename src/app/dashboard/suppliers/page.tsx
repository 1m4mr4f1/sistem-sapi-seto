import { getSuppliersPaginated } from '@/app/lib/data/supplier.data';
import SupplierTable from '@/app/components/dashboard/SupplierTable';
import Pagination from '@/app/components/dashboard/Pagination';
import { Plus, Truck } from 'lucide-react';
import Link from 'next/link';

export default async function SuppliersPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  const { suppliers, totalSuppliers, totalPages } = await getSuppliersPaginated(currentPage, itemsPerPage);

  const serializedSuppliers = suppliers.map((s) => ({
    id: String(s.id),
    supplier_name: s.supplier_name,
    contact: s.contact,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pt-2 flex items-center gap-2">
            <Truck className="text-blue-600" /> Manajemen Penyedia
          </h1>
          <p className="text-gray-500">Data supplier daging dan barang.</p>
        </div>
        
        <Link
          href="/dashboard/suppliers/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Penyedia</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <SupplierTable suppliers={serializedSuppliers} />
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalSuppliers}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}