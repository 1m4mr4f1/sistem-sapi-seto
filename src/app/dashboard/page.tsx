import { getDashboardStats } from '@/app/lib/data/dashboard.data';
import DashboardStats from '@/app/components/dashboard/DashboardStats';
import DashboardWidgets from '@/app/components/dashboard/DashboardWidgets';

export default async function DashboardPage() {
  // 1. Ambil data dari Model Layer (Database)
  // Fungsi ini sudah kita buat sebelumnya di dashboard.data.ts
  const { summary, recentSales, lowStockProducts } = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500">Ringkasan performa toko Sapi Seto hari ini.</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200">
          Update Terakhir: {new Date().toLocaleTimeString('id-ID')}
        </div>
      </div>
      
      {/* 2. View: Tampilkan Kartu Statistik (Omzet, Laba, dll) */}
      <DashboardStats summary={summary} />

      {/* 3. View: Tampilkan Widget (Stok Menipis & Transaksi Terakhir) */}
      <DashboardWidgets lowStockProducts={lowStockProducts} recentSales={recentSales} />
    </div>
  );
}