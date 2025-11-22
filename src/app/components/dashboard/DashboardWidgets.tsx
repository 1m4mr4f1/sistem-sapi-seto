'use client';

import Link from 'next/link';
import { AlertCircle, ShoppingCart, Package, ArrowRight } from 'lucide-react';

type Product = { id: bigint; product_name: string; stock: any }; // Decimal from Prisma
type Sale = { 
  id: bigint; 
  sale_date: Date; 
  final_total: any; 
  payment_status: string; 
  customer: { customer_name: string } | null 
};

interface WidgetsProps {
  lowStockProducts: Product[];
  recentSales: Sale[];
}

export default function DashboardWidgets({ lowStockProducts, recentSales }: WidgetsProps) {
  const toRupiah = (val: any) => 'Rp ' + Number(val).toLocaleString('id-ID');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Warning Stok */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> Peringatan Stok Menipis
          </h3>
          <Link href="/dashboard/products" className="text-sm text-blue-600 hover:underline">Lihat Semua</Link>
        </div>
        
        {lowStockProducts.length === 0 ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm text-center">Semua stok produk aman!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Nama Produk</th>
                  <th className="px-4 py-2 text-right">Sisa Stok</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map((p) => (
                  <tr key={String(p.id)}>
                    <td className="px-4 py-3 font-medium text-gray-700">{p.product_name}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{Number(p.stock)} Kg</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full">Restock Segera</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">Akses Cepat</h3>
          <p className="text-blue-100 text-sm mb-6">Menu yang paling sering digunakan kasir.</p>
          <div className="space-y-3">
            <Link href="/dashboard/sales/create" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors backdrop-blur-sm group">
              <span className="font-medium flex items-center gap-2"><ShoppingCart size={18}/> Buat Penjualan Baru</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link href="/dashboard/purchases/create" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors backdrop-blur-sm group">
              <span className="font-medium flex items-center gap-2"><Package size={18}/> Input Stok Masuk</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-500/30 text-xs text-blue-200"><p>Sistem Sapi Seto v1.0</p></div>
      </div>

      {/* 3. Recent Sales (Full Width di baris bawah) */}
      <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">5 Transaksi Terakhir</h3>
          <Link href="/dashboard/sales" className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Lihat Semua Riwayat</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSales.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi.</td></tr>
              ) : (
                recentSales.map((sale) => (
                  <tr key={String(sale.id)} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">#{String(sale.id)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(sale.sale_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{sale.customer ? sale.customer.customer_name : 'Pelanggan Umum'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sale.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {sale.payment_status === 'paid' ? 'Lunas' : 'Hutang'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{toRupiah(sale.final_total)}</td>
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