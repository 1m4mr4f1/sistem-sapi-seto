'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import PurchaseDetailModal from './PurchaseDetailModal'; // Pastikan Anda sudah membuat file ini

// Tipe data diperbarui untuk mencakup nested items (detail barang)
type PurchaseItem = {
  id: string;
  purchase_date: Date;
  supplier_name: string;
  total_purchase: number;
  payment_status: string;
  user_name: string;
  note: string | null;
  items: {
    product_name: string;
    quantity: number;
    cost_price: number;
  }[];
};

interface PurchaseTableProps {
  purchases: PurchaseItem[];
}

export default function PurchaseTable({ purchases }: PurchaseTableProps) {
  // State untuk mengontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);

  // Fungsi saat tombol "Lihat Detail" (Mata) diklik
  const handleViewDetail = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID / Tgl</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Tagihan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PJ (Admin)</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada data pembelian.</td></tr>
            ) : (
              purchases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-bold text-blue-600">#{item.id}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.purchase_date).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{item.supplier_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">Rp {item.total_purchase.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.user_name}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    {/* Tombol Aksi: Membuka Modal Detail */}
                    <button 
                      onClick={() => handleViewDetail(item)}
                      className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-full transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render Modal Detail di sini */}
      {/* Modal hanya akan muncul jika isModalOpen bernilai true */}
      <PurchaseDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        purchase={selectedPurchase} 
      />
    </>
  );
}