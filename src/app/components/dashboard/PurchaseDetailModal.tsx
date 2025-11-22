'use client';

import { X, ShoppingBag, Calendar, Truck, CreditCard, UserCheck, Printer } from 'lucide-react';

// Definisi tipe data untuk Purchase
type PurchaseDetailItem = {
  product_name: string;
  quantity: number;
  cost_price: number; // Harga beli
};

type PurchaseDetailData = {
  id: string;
  purchase_date: Date;
  supplier_name: string;
  user_name: string; // Penanggung jawab (Admin)
  total_purchase: number;
  payment_status: string;
  note: string | null;
  items: PurchaseDetailItem[];
};

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseDetailData | null;
}

export default function PurchaseDetailModal({ isOpen, onClose, purchase }: PurchaseDetailModalProps) {
  if (!isOpen || !purchase) return null;

  // FUNGSI UTAMA: Membuka halaman cetak di tab/jendela baru
  const handlePrint = () => {
    const url = `/dashboard/purchases/${purchase.id}/print`;
    // Membuka jendela baru dengan ukuran A4 proporsional
    const printWindow = window.open(url, '_blank', 'width=800,height=1123');
    if (printWindow) printWindow.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag size={20} className="text-orange-600" /> 
              Detail Pembelian (Stok Masuk)
            </h3>
            <p className="text-xs text-gray-500 mt-1">ID: #{purchase.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Content (Hanya untuk dilihat di layar) */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-orange-50/50 p-4 rounded-lg border border-orange-100">
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><Calendar size={14}/> Tanggal Masuk</p>
              <p className="font-medium text-gray-900">{new Date(purchase.purchase_date).toLocaleDateString('id-ID')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><Truck size={14}/> Supplier</p>
              <p className="font-medium text-gray-900">{purchase.supplier_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><CreditCard size={14}/> Status Pembayaran</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${purchase.payment_status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {purchase.payment_status === 'paid' ? 'LUNAS' : 'HUTANG'}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 flex items-center gap-2 text-xs uppercase font-semibold"><UserCheck size={14}/> PJ (Admin)</p>
              <p className="font-medium text-gray-900">{purchase.user_name}</p>
            </div>
          </div>

          {/* Tabel Barang */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
                <tr>
                  <th className="px-4 py-2">Produk</th>
                  <th className="px-4 py-2 text-center">Qty Masuk</th>
                  <th className="px-4 py-2 text-right">Harga Beli</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchase.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{item.product_name}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-gray-600">Rp {item.cost_price.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-right font-semibold">Rp {(item.quantity * item.cost_price).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total Tagihan</span>
                <span>Rp {purchase.total_purchase.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {purchase.note && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800">
              <span className="font-bold block mb-1">Catatan / No. Nota Supplier:</span>
              {purchase.note}
            </div>
          )}
        </div>

        {/* Footer dengan Tombol Cetak */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors">
            Tutup
          </button>
          <button onClick={handlePrint} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors">
            <Printer size={18} /> Cetak Bukti
          </button>
        </div>
      </div>
    </div>
  );
}