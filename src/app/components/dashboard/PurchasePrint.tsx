'use client';

import { useEffect } from 'react';

type PurchasePrintProps = {
  data: {
    id: string;
    date: Date;
    supplier: string;
    admin: string;
    items: {
      name: string;
      qty: number;
      price: number;
      total: number;
    }[];
    total: number;
    note: string | null;
  };
};

export default function PurchasePrint({ data }: PurchasePrintProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[99999] bg-gray-100 overflow-auto flex justify-center items-start p-8 print:p-0 print:bg-white print:static print:block">
      
      <div className="bg-white w-[210mm] min-h-[297mm] p-12 shadow-xl print:shadow-none print:w-full print:h-full relative flex flex-col mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-12 border-b-2 border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-1">SAPI SETO</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">BUKTI PENERIMAAN BARANG</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>Jl. Raya Daging No. 99, Kota Sapi</p>
              <p>Internal Document</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-1">PURCHASE</h2>
            <p className="text-gray-700 font-bold text-lg">#{data.id}</p>
          </div>
        </div>

        {/* INFO SUPPLIER */}
        <div className="flex justify-between mb-10">
          <div className="w-1/2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">DITERIMA DARI (SUPPLIER):</p>
            <h3 className="text-xl font-bold text-gray-800">{data.supplier}</h3>
            <p className="text-sm text-gray-500">Vendor Terdaftar</p>
          </div>
          <div className="w-1/2 text-right space-y-1">
            <div className="flex justify-end gap-4">
              <span className="font-bold text-gray-600">Tanggal Terima:</span>
              <span className="text-gray-900">{new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="font-bold text-gray-600">Penerima (Admin):</span>
              <span className="text-gray-900">{data.admin}</span>
            </div>
          </div>
        </div>

        {/* TABEL BARANG */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-4 text-left w-1/2">Nama Produk</th>
                <th className="py-3 px-4 text-center">Qty Masuk</th>
                <th className="py-3 px-4 text-right">Harga Beli</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="border border-gray-300 text-gray-700">
              {data.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-center">{item.qty}</td>
                  <td className="py-3 px-4 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right font-bold">Rp {item.total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex justify-end mb-20">
          <div className="w-1/2 bg-gray-50 p-6 rounded border border-gray-100">
            <div className="flex justify-between">
              <span className="font-bold text-gray-800 uppercase text-lg">Total Pembelian</span>
              <span className="font-bold text-gray-900 text-lg">Rp {data.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-8 border-t-2 border-gray-200 flex justify-between items-end">
          <div className="text-xs text-gray-500 w-2/3">
            <p className="font-bold text-gray-800 mb-1">Keterangan / Nota Supplier:</p>
            <div className="p-3 border border-gray-300 min-h-[60px] rounded bg-white italic">
              {data.note || '-'}
            </div>
          </div>
          <div className="text-center w-40">
            <p className="text-xs font-bold text-gray-400 mb-16">Disetujui Oleh,</p>
            <div className="border-b border-black mb-1"></div>
            <p className="font-bold text-sm uppercase">{data.admin}</p>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background-color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          header, footer, nav, aside { display: none !important; }
        } 
      `}</style>
    </div>
  );
}