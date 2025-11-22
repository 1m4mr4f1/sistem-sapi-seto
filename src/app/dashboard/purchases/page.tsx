import { getPurchasesPaginated } from '@/app/lib/data/purchase.data';
import PurchaseTable from '@/app/components/dashboard/PurchaseTable';
import Pagination from '@/app/components/dashboard/Pagination';
import { Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function PurchasesPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 10;

  // 1. Ambil data dari DB (fungsi ini sudah kita update sebelumnya untuk include purchase_details)
  const { purchases, totalPurchases, totalPages } = await getPurchasesPaginated(currentPage, itemsPerPage);

  // 2. Serialize Data (Format Ulang agar aman dikirim ke Client Component)
  // Kita mengubah BigInt/Decimal menjadi String/Number dan merapikan struktur array 'items'
  const serializedPurchases = purchases.map((p) => ({
    id: String(p.id),
    purchase_date: p.purchase_date,
    supplier_name: p.supplier.supplier_name,
    total_purchase: Number(p.total_purchase),
    payment_status: p.payment_status,
    user_name: p.user.name,
    note: p.note,
    
    // Mapping data nested 'purchase_details' menjadi 'items' yang sederhana
    items: p.purchase_details.map((d) => ({
      product_name: d.product ? d.product.product_name : 'Produk Dihapus',
      quantity: Number(d.quantity),
      cost_price: Number(d.price_at_purchase)
    }))
  }));

  return (
    <div>
      {/* Header Halaman & Tombol Buat Baru */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 pt-2 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> Riwayat Pembelian (Stok Masuk)
          </h1>
          <p className="text-gray-500">Kelola stok masuk dan hutang ke supplier.</p>
        </div>
        
        <Link
          href="/dashboard/purchases/create" 
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          <Plus size={20} />
          <span>Buat Pembelian Baru</span>
        </Link>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Kirim data yang sudah diserialize ke komponen tabel */}
        <PurchaseTable purchases={serializedPurchases} />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPurchases}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}