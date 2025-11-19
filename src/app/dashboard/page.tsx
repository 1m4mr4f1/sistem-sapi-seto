// src/app/dashboard/page.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Kartu Selamat Datang */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Sapi Seto</h1>
            <p className="text-gray-500">Selamat datang di panel manajemen sistem.</p>
          </div>
          
          {/* Tombol Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Area Konten Sementara */}
        <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-xl text-gray-400 font-medium">
            Ini Halaman Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}