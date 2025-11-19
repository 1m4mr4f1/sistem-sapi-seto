'use client';
import { signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
      {/* Bagian Kiri Header */}
      <div className="text-lg font-semibold text-gray-700">
        Sistem Manajemen Toko Daging
      </div>

      {/* Bagian Kanan (User & Logout) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
          <User size={18} />
          <span className="text-sm font-medium">Admin (Pak Seto)</span>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}