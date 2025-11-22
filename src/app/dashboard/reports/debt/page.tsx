import { getDebtReport } from '@/app/lib/data/report.data';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

export default async function DebtReportPage() {
  const { summary, receivableList, payableList } = await getDebtReport();

  const toRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/reports" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-2 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Menu Laporan
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="text-red-600" /> Laporan Hutang & Piutang
        </h1>
        <p className="text-gray-500 text-sm">Pantau tagihan yang belum lunas.</p>
      </div>

      {/* 1. KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Piutang (Uang Kita di Orang Lain) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
              <ArrowUpRight size={16} className="text-green-500"/> Total Piutang (Harus Ditagih)
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{toRupiah(summary.totalReceivable)}</h3>
            <p className="text-xs text-gray-400 mt-2">Bon pelanggan yang belum lunas</p>
          </div>
        </div>

        {/* Hutang (Uang Kita Harus Keluar) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
              <ArrowDownLeft size={16} className="text-red-500"/> Total Hutang (Harus Dibayar)
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{toRupiah(summary.totalPayable)}</h3>
            <p className="text-xs text-gray-400 mt-2">Tagihan supplier yang belum lunas</p>
          </div>
        </div>
      </div>

      {/* 2. TABEL PIUTANG (RECEIVABLES) */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-green-500 rounded-full"></span>
          Daftar Piutang Pelanggan (Bon)
        </h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-green-50 text-green-800 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Tgl / ID</th>
                  <th className="px-6 py-3">Pelanggan</th>
                  <th className="px-6 py-3">Kontak</th>
                  <th className="px-6 py-3 text-right">Total Tagihan</th>
                  <th className="px-6 py-3 text-right">Sudah Bayar</th>
                  <th className="px-6 py-3 text-right">Sisa Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receivableList.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada piutang pelanggan. Semua lunas!</td></tr>
                ) : (
                  receivableList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-bold text-gray-800">#{item.id}</div>
                        <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-700">{item.party_name}</td>
                      <td className="px-6 py-3 text-gray-500">{item.contact}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{toRupiah(item.total)}</td>
                      <td className="px-6 py-3 text-right text-green-600 font-medium">{toRupiah(item.paid)}</td>
                      <td className="px-6 py-3 text-right font-bold text-red-600 bg-red-50/30">
                        {toRupiah(item.remaining)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. TABEL HUTANG (PAYABLES) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-red-500 rounded-full"></span>
          Daftar Hutang ke Supplier
        </h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-red-50 text-red-800 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Tgl / ID</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Kontak</th>
                  <th className="px-6 py-3 text-right">Total Tagihan</th>
                  <th className="px-6 py-3 text-right">Sudah Bayar</th>
                  <th className="px-6 py-3 text-right">Sisa Hutang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payableList.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada hutang ke supplier. Semua lunas!</td></tr>
                ) : (
                  payableList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <div className="font-bold text-gray-800">#{item.id}</div>
                        <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-700">{item.party_name}</td>
                      <td className="px-6 py-3 text-gray-500">{item.contact}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{toRupiah(item.total)}</td>
                      <td className="px-6 py-3 text-right text-green-600 font-medium">{toRupiah(item.paid)}</td>
                      <td className="px-6 py-3 text-right font-bold text-red-600 bg-red-50/30">
                        {toRupiah(item.remaining)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}