import Link from 'next/link';
import { BarChart3, Wallet, Package, Receipt, ChevronRight, TrendingUp } from 'lucide-react';

export default function ReportsDashboardPage() {
  const reports = [
    {
      title: 'Laporan Penjualan',
      description: 'Analisa omzet harian, produk terlaris, dan performa kasir.',
      icon: <BarChart3 size={32} />,
      href: '/dashboard/reports/sales',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      borderColor: 'hover:border-blue-200'
    },
    {
      title: 'Laporan Keuangan (Laba)',
      description: 'Hitung laba kotor (Omzet - Modal) dan pengeluaran operasional.',
      icon: <Wallet size={32} />,
      href: '/dashboard/reports/financial',
      color: 'text-green-600',
      bg: 'bg-green-50',
      borderColor: 'hover:border-green-200'
    },
    {
      title: 'Laporan Stok Gudang',
      description: 'Monitoring sisa stok, nilai aset barang, dan stok menipis.',
      icon: <Package size={32} />,
      href: '/dashboard/reports/inventory',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      borderColor: 'hover:border-orange-200'
    },
    {
      title: 'Hutang & Piutang',
      description: 'Pantau tagihan supplier yang belum lunas dan bon pelanggan.',
      icon: <Receipt size={32} />,
      href: '/dashboard/reports/debt',
      color: 'text-red-600',
      bg: 'bg-red-50',
      borderColor: 'hover:border-red-200'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 pt-2 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> Pusat Laporan & Analitik
        </h1>
        <p className="text-gray-500">Pilih jenis laporan untuk melihat detail performa bisnis Sapi Seto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <Link 
            key={index} 
            href={report.href}
            className={`block bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${report.borderColor} group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`p-3 rounded-lg ${report.bg} ${report.color}`}>
                  {report.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                <ChevronRight size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}