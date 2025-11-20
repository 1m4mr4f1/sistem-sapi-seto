import Link from 'next/link';
// Tambahkan import 'Truck'
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, Truck } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#2c3e50] text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-600 bg-[#1a252f]">
        <h1 className="text-xl font-bold uppercase tracking-wider">Sapi Seto</h1>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-6 text-xs text-gray-400 uppercase font-bold mb-2">Menu Utama</p>
        
        <Link href="/dashboard" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
          <LayoutDashboard size={18} className="mr-3" />
          <span>Dashboard</span>
        </Link>

        <Link href="/dashboard/products" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
          <Package size={18} className="mr-3" />
          <span>Data Produk</span>
        </Link>

        <Link href="/dashboard/sales" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
          <ShoppingCart size={18} className="mr-3" />
          <span>Penjualan</span>
        </Link>

        <Link href="/dashboard/customers" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
          <Users size={18} className="mr-3" />
          <span>Pelanggan</span>
        </Link>

        {/* MENU BARU: SUPPLIERS */}
        <Link href="/dashboard/suppliers" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
          <Truck size={18} className="mr-3" />
          <span>Penyedia (Supplier)</span>
        </Link>

        <p className="px-6 text-xs text-gray-400 uppercase font-bold mb-2 mt-4">Lainnya</p>

        <Link href="/dashboard/reports" className="flex items-center px-6 py-3 text-gray-300 hover:bg-[#34495e] hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500">
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