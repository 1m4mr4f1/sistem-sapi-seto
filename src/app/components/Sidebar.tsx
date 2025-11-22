'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ShoppingBag, // Icon untuk Pembelian
  Users, 
  FileText, 
  Truck 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Helper function untuk cek status aktif
  const isActive = (path: string) => {
    // Khusus Dashboard (root), harus exact match
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    // Untuk menu lain, gunakan startsWith agar sub-halaman (create/edit) tetap menyalakan menu induknya
    return pathname.startsWith(path);
  };

  // Class untuk menu aktif vs tidak aktif
  const getLinkClass = (path: string) => {
    const activeClass = "bg-[#34495e] text-white border-blue-500";
    const inactiveClass = "text-gray-300 hover:bg-[#34495e] hover:text-white border-transparent hover:border-blue-500";
    
    return `flex items-center px-6 py-3 transition-colors border-l-4 ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="w-64 bg-[#2c3e50] text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-600 bg-[#1a252f]">
        <h1 className="text-xl font-bold uppercase tracking-wider">Sapi Seto</h1>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-6 text-xs text-gray-400 uppercase font-bold mb-2">Menu Utama</p>
        
        <Link href="/dashboard" className={getLinkClass('/dashboard')}>
          <LayoutDashboard size={18} className="mr-3" />
          <span>Dashboard</span>
        </Link>

        <Link href="/dashboard/products" className={getLinkClass('/dashboard/products')}>
          <Package size={18} className="mr-3" />
          <span>Data Produk</span>
        </Link>

        {/* MENU BARU: PEMBELIAN */}
        <Link href="/dashboard/purchases" className={getLinkClass('/dashboard/purchases')}>
          <ShoppingBag size={18} className="mr-3" />
          <span>Pembelian</span>
        </Link>

        <Link href="/dashboard/sales" className={getLinkClass('/dashboard/sales')}>
          <ShoppingCart size={18} className="mr-3" />
          <span>Penjualan</span>
        </Link>

        <Link href="/dashboard/customers" className={getLinkClass('/dashboard/customers')}>
          <Users size={18} className="mr-3" />
          <span>Pelanggan</span>
        </Link>

        <Link href="/dashboard/suppliers" className={getLinkClass('/dashboard/suppliers')}>
          <Truck size={18} className="mr-3" />
          <span>Penyedia</span>
        </Link>

        <p className="px-6 text-xs text-gray-400 uppercase font-bold mb-2 mt-4">Lainnya</p>

        <Link href="/dashboard/reports" className={getLinkClass('/dashboard/reports')}>
          <FileText size={18} className="mr-3" />
          <span>Laporan</span>
        </Link>
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 bg-[#1a252f] text-xs text-center text-gray-500">
        &copy; 2025 Sapi Seto System
      </div>
    </aside>
  );
}