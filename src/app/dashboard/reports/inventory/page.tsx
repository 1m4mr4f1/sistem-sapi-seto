import { getInventoryReport } from '@/app/lib/data/report.data';
import { ArrowLeft, Package, AlertTriangle, Box, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function InventoryReportPage() {
  const { summary, inventory } = await getInventoryReport();

  const toRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/reports" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-2 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Kembali ke Menu Laporan
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="text-orange-600" /> Laporan Stok Gudang
        </h1>
        <p className="text-gray-500 text-sm">Kondisi stok barang saat ini (Real-time).</p>
      </div>

      {/* 1. KARTU RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Nilai Aset */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Nilai Aset</p>
            <h3 className="text-2xl font-bold text-gray-800">{toRupiah(summary.totalAssetValue)}</h3>
            <p className="text-xs text-gray-400 mt-1">(Berdasarkan harga beli terakhir)</p>
          </div>
        </div>

        {/* Total Fisik */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Box size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Barang Fisik</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.totalStockItems.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">Unit/Kg</span></h3>
          </div>
        </div>

        {/* Warning Stok */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className={`p-3 rounded-full ${summary.lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Stok Menipis / Habis</p>
            <h3 className={`text-2xl font-bold ${summary.lowStockCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {summary.lowStockCount} <span className="text-sm font-normal text-gray-500">Produk</span>
            </h3>
          </div>
        </div>
      </div>

      {/* 2. TABEL STOK */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Rincian Stok Produk</h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-300">
            Total Produk: {summary.totalProducts}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 font-bold border-b uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Nama Produk</th>
                <th className="px-6 py-3 text-right">Harga Beli Terakhir</th>
                <th className="px-6 py-3 text-center">Sisa Stok</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Nilai Aset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada data produk.</td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">
                        {item.product_name}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-500">
                        {toRupiah(item.last_purchase_price)}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-gray-800">
                        {item.stock.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase
                            ${item.status === 'Habis' ? 'bg-red-100 text-red-700' : 
                              item.status === 'Menipis' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-green-100 text-green-700'
                            }
                        `}>
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-blue-600">
                        {toRupiah(item.asset_value)}
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