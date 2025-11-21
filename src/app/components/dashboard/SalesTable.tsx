'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import SaleDetailModal from './SaleDetailModal'; // Import Modal yang baru dibuat

// Tipe data yang diterima dari page.tsx (harus lengkap dengan items)
type SaleItem = {
  id: string;
  sale_date: Date;
  customer_name: string;
  final_total: number;
  subtotal: number;
  discount: number;
  payment_status: string;
  cashier_name: string;
  note: string | null;
  // Nested Items (Detail Barang)
  items: {
    product_name: string;
    quantity: number;
    price: number;
  }[];
};

interface SalesTableProps {
  sales: SaleItem[];
}

export default function SalesTable({ sales }: SalesTableProps) {
  // State untuk mengontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleItem | null>(null);

  const handleViewDetail = (sale: SaleItem) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID Transaksi</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pelanggan</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kasir</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Belum ada transaksi penjualan.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-blue-600 font-bold">#{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sale.sale_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">Rp {sale.final_total.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sale.payment_status === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{sale.cashier_name}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button 
                      onClick={() => handleViewDetail(sale)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded-full" 
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

      {/* Render Modal (Akan muncul jika isModalOpen = true) */}
      <SaleDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        sale={selectedSale} 
      />
    </>
  );
}