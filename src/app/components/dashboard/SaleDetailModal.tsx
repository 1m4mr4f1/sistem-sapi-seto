'use client';

import { X, ShoppingBag, Calendar, User, CreditCard, UserCheck } from 'lucide-react';

// Tipe data khusus untuk Modal
type SaleDetailItem = {
  product_name: string;
  quantity: number;
  price: number;
};

type SaleDetailData = {
  id: string;
  sale_date: Date;
  customer_name: string;
  cashier_name: string;
  subtotal: number;
  discount: number;
  final_total: number;
  payment_status: string;
  note: string | null;
  items: SaleDetailItem[]; // Array barang belanjaan
};

interface SaleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleDetailData | null;
}

export default function SaleDetailModal({ isOpen, onClose, sale }: SaleDetailModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Card Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-600" /> 
              Detail Transaksi
            </h3>
            <p className="text-xs text-gray-500 mt-1">ID: #{sale.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Info Utama Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><Calendar size={14}/> Tanggal Transaksi</p>
              <p className="font-medium text-gray-900">
                {new Date(sale.sale_date).toLocaleDateString('id-ID', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><User size={14}/> Pelanggan</p>
              <p className="font-medium text-gray-900">{sale.customer_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><CreditCard size={14}/> Status Pembayaran</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sale.payment_status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {sale.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><UserCheck size={14}/> Kasir Bertugas</p>
              <p className="font-medium text-gray-900">{sale.cashier_name}</p>
            </div>
          </div>

          {/* Tabel Barang */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Rincian Barang</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Harga (@)</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sale.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 font-medium">{item.product_name}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold">Rp {(item.quantity * item.price).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ringkasan Angka (Kanan Bawah) */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rp {sale.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Diskon</span>
                  <span>- Rp {sale.discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>Rp {sale.final_total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {sale.note && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex gap-2 items-start">
              <span className="font-bold">Catatan:</span>
              <p>{sale.note}</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Tutup
          </button>
          <button 
            onClick={() => window.print()} 
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag size={18} /> Cetak Nota
          </button>
        </div>
      </div>
    </div>
  );
}