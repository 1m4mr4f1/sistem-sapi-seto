'use client';

import { useEffect } from 'react';

type SalePrintProps = {
  data: {
    id: string;
    date: Date;
    cashier: string;
    customer: string;
    items: {
      name: string;
      qty: number;
      price: number;
      total: number;
    }[];
    subtotal: number;
    discount: number;
    finalTotal: number;
    note: string | null;
  };
};

export default function SalePrint({ data }: SalePrintProps) {
  // Otomatis memicu print dialog saat halaman dimuat
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="p-4 max-w-[80mm] mx-auto bg-white text-black font-mono text-xs leading-tight">
      {/* Header Toko */}
      <div className="text-center mb-4 border-b border-black pb-2 border-dashed">
        <h1 className="text-lg font-bold uppercase">SAPI SETO</h1>
        <p>Jl. Raya Daging No. 1, Kota Sapi</p>
        <p>Telp: 0812-3456-7890</p>
      </div>

      {/* Info Transaksi */}
      <div className="mb-2">
        <div className="flex justify-between">
          <span>No: {data.id}</span>
          <span>{new Date(data.date).toLocaleDateString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir: {data.cashier}</span>
          <span>{new Date(data.date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div>Plg: {data.customer}</div>
      </div>

      {/* Garis Pemisah */}
      <div className="border-b border-black border-dashed my-2"></div>

      {/* Item Belanja */}
      <div className="space-y-2 mb-2">
        {data.items.map((item, index) => (
          <div key={index}>
            <div>{item.name}</div>
            <div className="flex justify-between pl-2">
              <span>{item.qty} x {item.price.toLocaleString('id-ID')}</span>
              <span>{item.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-b border-black border-dashed my-2"></div>

      {/* Total */}
      <div className="space-y-1 text-right">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{data.subtotal.toLocaleString('id-ID')}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between">
            <span>Diskon:</span>
            <span>({data.discount.toLocaleString('id-ID')})</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm mt-1">
          <span>TOTAL:</span>
          <span>Rp {data.finalTotal.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="border-b border-black border-dashed my-4"></div>

      {/* Footer */}
      <div className="text-center space-y-1">
        <p>Terima Kasih atas kunjungan Anda</p>
        <p>Barang yang sudah dibeli</p>
        <p>tidak dapat ditukar/dikembalikan</p>
        {data.note && (
          <p className="mt-2 italic font-normal">Catatan: {data.note}</p>
        )}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}