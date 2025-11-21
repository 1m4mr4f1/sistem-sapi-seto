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
  // Auto print saat halaman dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Hitung jatuh tempo (contoh +14 hari)
  const dueDate = new Date(data.date);
  dueDate.setDate(dueDate.getDate() + 14);

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white flex justify-center items-start font-sans text-gray-700 text-sm">
      
      {/* Lembar A4 */}
      <div className="bg-white w-[210mm] min-h-[297mm] p-12 shadow-xl print:shadow-none print:w-full print:h-full relative flex flex-col">
        
        {/* 1. LOGO (Kanan Atas) */}
        <div className="flex justify-end mb-10">
          <div className="flex items-center gap-2">
            {/* Placeholder Logo - Ganti dengan <img> jika ada */}
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              SS
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-green-700 uppercase tracking-wide">SAPI SETO</h1>
              <p className="text-[10px] text-gray-400 uppercase">Premium Meat Shop</p>
            </div>
          </div>
        </div>

        {/* 2. INFO TANGGAL & PELANGGAN (Sejajar) */}
        <div className="flex justify-between items-start mb-12">
          {/* Kiri: Tanggal */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <span className="font-bold text-gray-800 w-24">Tanggal:</span>
              <span>{new Date(data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-800 w-24 italic">Jatuh Tempo:</span>
              <span className="italic">{dueDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-gray-800 w-24">No. Invoice:</span>
              <span className="text-gray-600">#{data.id}</span>
            </div>
          </div>

          {/* Kanan: Pelanggan */}
          <div className="w-64">
            <h3 className="font-bold text-gray-800 uppercase mb-1">PELANGGAN</h3>
            <p className="font-semibold text-lg text-black">{data.customer}</p>
            <p className="text-gray-500 text-xs mt-1">[Alamat Pelanggan belum tersedia]</p>
          </div>
        </div>

        {/* 3. TABEL BARANG */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              {/* Header Abu-abu sesuai gambar */}
              <tr className="bg-gray-500 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4 text-left font-semibold w-[40%] border-r border-gray-400">NAMA</th>
                <th className="py-3 px-4 text-center font-semibold w-[10%] border-r border-gray-400">JUMLAH</th>
                <th className="py-3 px-4 text-right font-semibold w-[20%] border-r border-gray-400">HARGA SATUAN</th>
                <th className="py-3 px-4 text-right font-semibold w-[20%] border-r border-gray-400">SUB TOTAL</th>
                <th className="py-3 px-4 text-center font-semibold w-[10%]">DISKON</th>
              </tr>
            </thead>
            <tbody className="border border-gray-300 text-gray-700">
              {data.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 border-r border-gray-200 font-medium">{item.name}</td>
                  <td className="py-3 px-4 border-r border-gray-200 text-center">{item.qty}</td>
                  <td className="py-3 px-4 border-r border-gray-200 text-right">{item.price.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 border-r border-gray-200 text-right font-bold">{item.total.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-center text-gray-400">-</td> 
                </tr>
              ))}
              
              {/* Baris Kosong agar tabel tinggi (Opsional) */}
              {Array.from({ length: Math.max(0, 4 - data.items.length) }).map((_, i) => (
                 <tr key={`empty-${i}`} className="border-b border-gray-100 h-12">
                   <td className="border-r border-gray-200"></td>
                   <td className="border-r border-gray-200"></td>
                   <td className="border-r border-gray-200"></td>
                   <td className="border-r border-gray-200"></td>
                   <td></td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. TOTAL (Kanan Bawah) */}
        <div className="flex justify-end mb-20">
          <div className="w-1/2 pr-4">
            <div className="flex justify-between py-2">
              <span className="font-bold text-gray-600 uppercase text-xs">SUB TOTAL</span>
              <span className="font-bold text-gray-800">Rp {data.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between py-2 text-green-600">
                <span className="font-bold uppercase text-xs">DISKON</span>
                <span className="font-bold">- Rp {data.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between py-2 mt-2 border-t-2 border-gray-200">
              <span className="font-bold text-gray-900 uppercase text-lg">Total</span>
              <span className="font-bold text-gray-900 text-lg">Rp {data.finalTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* 5. FOOTER (Info Perusahaan & Bank) */}
        <div className="mt-auto pt-8 border-t border-gray-300 flex justify-between items-start text-xs text-gray-600">
          
          {/* Kiri: Info Perusahaan Sendiri */}
          <div className="w-1/2 space-y-1">
            <p className="font-bold text-gray-900 text-sm mb-2">[SAPI SETO]</p>
            <p>Jl. Raya Daging No. 99, Kota Sapi</p>
            <p>Jawa Tengah, 57771</p>
            <p>Telepon: 0812-3456-7890</p>
            {data.note && (
                <p className="mt-3 italic bg-yellow-50 p-1 inline-block border border-yellow-200 text-yellow-800">
                    Catatan: {data.note}
                </p>
            )}
          </div>

          {/* Kanan: Info Pembayaran (Bank) */}
          <div className="w-1/2 pl-10 space-y-1">
            <p className="font-bold text-gray-900 text-sm mb-2 italic">[Info Pembayaran]</p>
            <div className="grid grid-cols-3 gap-1">
                <span className="font-semibold">Bank:</span>
                <span className="col-span-2">BCA</span>
                
                <span className="font-semibold">No. Rek:</span>
                <span className="col-span-2 font-mono">123-456-7890</span>
                
                <span className="font-semibold">Atas Nama:</span>
                <span className="col-span-2">Sapi Seto</span>
            </div>
          </div>
        </div>

      </div>

      {/* CSS KHUSUS PRINT */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background-color: white;
            margin: 0;
            padding: 0;
            /* PENTING: Agar background header tabel tercetak */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Sembunyikan elemen browser bawaan */
          header, footer, nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}