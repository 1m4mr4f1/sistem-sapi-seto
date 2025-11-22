'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function ReportDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default: Ambil dari URL atau hari ini
  const defaultStart = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
  const defaultEnd = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const handleFilter = () => {
    router.push(`?startDate=${startDate}&endDate=${endDate}`);
  };

  const setPeriod = (days: number) => {
    const end = new Date();
    const start = new Date();
    
    if (days === 30) {
        // Bulan Ini (Tanggal 1 s/d Sekarang)
        start.setDate(1);
    } else {
        // X hari terakhir
        start.setDate(end.getDate() - days);
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    setStartDate(startStr);
    setEndDate(endStr);
    router.push(`?startDate=${startStr}&endDate=${endStr}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        
        {/* Input Tanggal */}
        <div className="flex items-center gap-2">
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Dari Tanggal</label>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                />
            </div>
            <span className="text-gray-400 mb-2">-</span>
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Sampai Tanggal</label>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800"
                />
            </div>
        </div>

        {/* Tombol Filter */}
        <button 
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
            <Filter size={16} /> Tampilkan
        </button>

        {/* Tombol Cepat (Shortcut) */}
        <div className="flex gap-2 md:ml-auto">
            <button onClick={() => setPeriod(0)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">Hari Ini</button>
            <button onClick={() => setPeriod(7)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">7 Hari</button>
            <button onClick={() => setPeriod(30)} className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors">Bulan Ini</button>
        </div>

      </div>
    </div>
  );
}