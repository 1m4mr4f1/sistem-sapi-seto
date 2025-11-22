import { getSalesReport } from '@/app/lib/data/report.data';
import ReportDateFilter from '@/app/components/dashboard/ReportDateFilter'; 
import { ArrowLeft, BarChart3, Banknote, CreditCard, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default async function SalesReportPage({ searchParams }: { searchParams: { startDate?: string; endDate?: string } }) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const startDateParam = searchParams.startDate || firstDayOfMonth.toISOString().split('T')[0];
  const endDateParam = searchParams.endDate || today.toISOString().split('T')[0];

  const { summary, sales } = await getSalesReport({
    startDate: new Date(startDateParam),
    endDate: new Date(endDateParam)
  });

  const toRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/reports" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-2 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Menu Laporan
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" /> Laporan Penjualan
        </h1>
        <p className="text-gray-500 text-sm">
          Periode: <span className="font-semibold text-gray-700">{new Date(startDateParam).toLocaleDateString('id-ID')}</span> s/d <span className="font-semibold text-gray-700">{new Date(endDateParam).toLocaleDateString('id-ID')}</span>
        </p>
      </div>

      {/* Component Filter Baru */}
      <ReportDateFilter />

      {/* 1. KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><Banknote size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Omzet (Kotor)</p>
            <h3 className="text-2xl font-bold text-gray-800">{toRupiah(summary.totalRevenue)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Jumlah Transaksi</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.totalTransactions} Trx</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><CreditCard size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Rata-rata Belanja</p>
            <h3 className="text-2xl font-bold text-gray-800">{toRupiah(summary.averageTransaction)}</h3>
          </div>
        </div>
      </div>

      {/* 2. TABEL RINCIAN */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Rincian Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase">
              <tr>
                <th className="px-6 py-3">Tanggal / ID</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Kasir</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Tidak ada data penjualan pada periode ini.</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={String(sale.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                        <div className="font-bold text-gray-900">#{String(sale.id)}</div>
                        <div className="text-xs text-gray-500">{new Date(sale.sale_date).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{sale.customer ? sale.customer.customer_name : 'Pelanggan Umum'}</td>
                    <td className="px-6 py-3 text-gray-500">{sale.user.name}</td>
                    <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${sale.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {sale.payment_status === 'paid' ? 'Lunas' : 'Hutang'}
                        </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-gray-900">Rp {Number(sale.final_total).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}