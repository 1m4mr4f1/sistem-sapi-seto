// src/app/dashboard/page.tsx
import { prisma } from '@/lib/prisma';
import { Package, ShoppingCart, Users, CreditCard } from 'lucide-react';
import ProductTable from '@/app/components/dashboard/ProductTable';
import Pagination from '@/app/components/dashboard/Pagination';

interface DashboardPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Pagination settings
  const itemsPerPage = 10;
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * itemsPerPage;

  // Ambil data real dari database
  const totalProduk = await prisma.product.count();
  const totalPenjualan = await prisma.sale.count();
  const totalCustomer = await prisma.customer.count();
  
  // Ambil produk dengan pagination (server-side)
  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      take: itemsPerPage,
      skip: skip,
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        product_name: true,
        stock: true,
        selling_price: true
      }
    }),
    prisma.product.count() // Total untuk pagination
  ]);

  // Serialize data - convert Decimal ke Number
  const serializedProducts = products.map((p) => ({
    id: String(p.id),
    product_name: p.product_name,
    stock: Number(p.stock),
    selling_price: Number(p.selling_price),
  }));

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Widget 1 - Merah (Produk) */}
        <div className="bg-red-500 rounded-lg shadow-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold">{totalProduk}</h3>
            <p className="text-red-100 uppercase text-sm font-semibold mt-1">Total Produk</p>
          </div>
          <Package size={48} className="text-red-300 opacity-50" />
        </div>

        {/* Widget 2 - Hijau (Penjualan) */}
        <div className="bg-green-500 rounded-lg shadow-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold">{totalPenjualan}</h3>
            <p className="text-green-100 uppercase text-sm font-semibold mt-1">Transaksi</p>
          </div>
          <ShoppingCart size={48} className="text-green-300 opacity-50" />
        </div>

        {/* Widget 3 - Biru (Customer) */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold">{totalCustomer}</h3>
            <p className="text-blue-100 uppercase text-sm font-semibold mt-1">Pelanggan</p>
          </div>
          <Users size={48} className="text-blue-300 opacity-50" />
        </div>

        {/* Widget 4 - Orange (Keuangan) */}
        <div className="bg-orange-500 rounded-lg shadow-lg p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold">Aman</h3>
            <p className="text-orange-100 uppercase text-sm font-semibold mt-1">Status Keuangan</p>
          </div>
          <CreditCard size={48} className="text-orange-300 opacity-50" />
        </div>
      </div>

      {/* Area Kosong untuk Grafik/Tabel (Placeholder) */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[300px]">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Aktivitas Terbaru</h3>
        <p className="text-gray-500">Belum ada aktivitas terbaru yang ditampilkan.</p>
      </div>

      {/* Tabel Data Produk */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Data Produk Terbaru</h3>
        <ProductTable products={serializedProducts} />
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