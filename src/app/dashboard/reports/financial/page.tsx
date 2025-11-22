import { getFinancialReport } from '@/app/lib/data/report.data';
import ReportDateFilter from '@/app/components/dashboard/ReportDateFilter';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function FinancialReportPage({ searchParams }: { searchParams: { startDate?: string; endDate?: string } }) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const startDateParam = searchParams.startDate || firstDayOfMonth.toISOString().split('T')[0];
  const endDateParam = searchParams.endDate || today.toISOString().split('T')[0];

  const { summary, expenses } = await getFinancialReport({
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
          <Wallet className="text-green-600" /> Laporan Keuangan & Laba
        </h1>
        <p className="text-gray-500 text-sm">
          Periode: <span className="font-semibold text-gray-700">{new Date(startDateParam).toLocaleDateString('id-ID')}</span> s/d <span className="font-semibold text-gray-700">{new Date(endDateParam).toLocaleDateString('id-ID')}</span>
        </p>
      </div>

      {/* Filter Tanggal (Reused Component) */}
      <ReportDateFilter />

      {/* 1. KARTU RINGKASAN UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Omzet */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><DollarSign size={20} /></div>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Pemasukan</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{toRupiah(summary.totalRevenue)}</h3>
        </div>

        {/* Laba Kotor */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
            <p className="text-xs text-gray-500 uppercase font-bold">Laba Kotor</p>
          </div>
          <h3 className="text-2xl font-bold text-green-600">{toRupiah(summary.totalGrossProfit)}</h3>
          <p className="text-xs text-gray-400 mt-1">(Omzet - HPP Modal)</p>
        </div>

        {/* Pengeluaran Operasional */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
            <p className="text-xs text-gray-500 uppercase font-bold">Biaya Operasional</p>
          </div>
          <h3 className="text-2xl font-bold text-red-600">{toRupiah(summary.totalOperationalExpense)}</h3>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 bg-gradient-to-br from-white to-green-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 text-white rounded-lg"><Wallet size={20} /></div>
            <p className="text-xs text-gray-600 uppercase font-bold">Estimasi Laba Bersih</p>
          </div>
          <h3 className="text-2xl font-bold text-green-800">{toRupiah(summary.netProfit)}</h3>
          <p className="text-xs text-gray-500 mt-1">(Laba Kotor - Operasional)</p>
        </div>
      </div>

      {/* 2. INFO TAMBAHAN (Cashflow Stok) */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-orange-800">Uang Keluar untuk Stok (Restock)</h4>
          <p className="text-sm text-orange-700">Total pembelian barang ke supplier dalam periode ini.</p>
        </div>
        <div className="text-xl font-bold text-orange-900">
          {toRupiah(summary.totalRestockCost)}
        </div>
      </div>

      {/* 3. TABEL PENGELUARAN OPERASIONAL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Rincian Pengeluaran Operasional</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 font-bold border-b">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Keterangan</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">PJ (Admin)</th>
                <th className="px-6 py-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data pengeluaran operasional pada periode ini.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={String(exp.id)} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">
                        {new Date(exp.expense_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                        {exp.description}
                    </td>
                    <td className="px-6 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            {exp.expense_type}
                        </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                        {exp.user.name}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-red-600">
                        {toRupiah(Number(exp.amount))}
                    </td>
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