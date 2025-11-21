import { getSalesPaginated } from '@/app/lib/data/sale.data'; // Import model data
import SalesTable from '@/app/components/dashboard/SalesTable'; // Import tabel
import Pagination from '@/app/components/dashboard/Pagination';
import { Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default async function SalesPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  // 1. Ambil data dari DB (termasuk detail items)
  const { sales, totalSales, totalPages } = await getSalesPaginated(currentPage, itemsPerPage);

  // 2. Serialize Data (Format Ulang untuk Client Component)
  // Mengubah BigInt/Decimal ke String/Number dan meratakan struktur object
  const serializedSales = sales.map((s) => ({
    id: String(s.id),
    sale_date: s.sale_date,
    customer_name: s.customer ? s.customer.customer_name : 'Pelanggan Umum',
    
    // Konversi Decimal ke Number
    final_total: Number(s.final_total),
    subtotal: Number(s.subtotal),
    discount: Number(s.discount),
    
    payment_status: s.payment_status,
    cashier_name: s.user.name,
    note: s.note,

    // Mapping Detail Barang (Nested Array) agar siap ditampilkan di Modal
    items: s.sale_details.map((detail) => ({
      product_name: detail.product ? detail.product.product_name : 'Produk Dihapus',
      quantity: Number(detail.quantity),
      price: Number(detail.price_at_sale),
    }))
  }));

  return (
    <div>
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pt-2 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" /> Riwayat Penjualan
          </h1>
          <p className="text-gray-500">Daftar transaksi penjualan toko.</p>
        </div>
        
        <Link
          href="/dashboard/sales/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          <span>Buat Transaksi Baru</span>
        </Link>
      </div>

      {/* Render Tabel dengan Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <SalesTable sales={serializedSales} />
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalSales}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}