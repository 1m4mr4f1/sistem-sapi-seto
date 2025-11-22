'use client';

import { TrendingUp, TrendingDown, Wallet, Users } from 'lucide-react';

type StatsProps = {
  summary: {
    totalProduk: number;
    totalCustomer: number;
    totalTransaction: number;
    totalRevenue: number;
    totalOutcome: number;
    totalPurchaseCost: number;
    totalExpense: number;
    netProfit: number;
  };
};

const toRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

export default function DashboardStats({ summary }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Omzet */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Omzet</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{toRupiah(summary.totalRevenue)}</h3>
          </div>
          <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={24} /></div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Dari <span className="font-bold text-gray-800">{summary.totalTransaction}</span> transaksi</div>
      </div>

      {/* Pengeluaran */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{toRupiah(summary.totalOutcome)}</h3>
          </div>
          <div className="p-2 bg-red-100 text-red-600 rounded-lg"><TrendingDown size={24} /></div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Stok: {toRupiah(summary.totalPurchaseCost)} | Ops: {toRupiah(summary.totalExpense)}</div>
      </div>

      {/* Laba */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estimasi Laba (Cash)</p>
            <h3 className={`text-2xl font-bold mt-1 ${summary.netProfit >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{toRupiah(summary.netProfit)}</h3>
          </div>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wallet size={24} /></div>
        </div>
        <div className="mt-4 text-xs text-gray-500">Selisih Pemasukan - Pengeluaran</div>
      </div>

      {/* Data Master */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data Master</p>
            <div className="flex gap-4 mt-2">
              <div><span className="text-xl font-bold text-gray-800">{summary.totalCustomer}</span><p className="text-[10px] text-gray-400">Pelanggan</p></div>
              <div className="w-px bg-gray-200 h-8"></div>
              <div><span className="text-xl font-bold text-gray-800">{summary.totalProduk}</span><p className="text-[10px] text-gray-400">Produk</p></div>
            </div>
          </div>
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users size={24} /></div>
        </div>
      </div>
    </div>
  );
}