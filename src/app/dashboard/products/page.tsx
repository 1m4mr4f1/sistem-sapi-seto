// src/app/dashboard/products/page.tsx
import { getProductsPaginated } from '@/app/lib/data/product.data';
import ProductTable from '@/app/components/dashboard/ProductTable';
import Pagination from '@/app/components/dashboard/Pagination';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface ProductsPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  // Ambil data dengan pagination
  const { products, totalProducts, totalPages } = await getProductsPaginated(currentPage, itemsPerPage);

  // Serialize data untuk client component - convert semua Decimal ke Number
  const serializedProducts = products.map((p) => ({
    id: String(p.id),
    product_name: p.product_name,
    stock: Number(p.stock),
    selling_price: Number(p.selling_price),
  }));

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pt-2">Manajemen Produk</h1>
          <p className="text-gray-500">Kelola stok daging dan harga jual.</p>
        </div>
        
        <Link
          href="/dashboard/products/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ProductTable products={serializedProducts} />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalProducts}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}