import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. SIDEBAR (Fixed Left) */}
      <Sidebar />

      {/* 2. HEADER (Fixed Top, sebelah kanan sidebar) */}
      <Header />

      {/* 3. KONTEN UTAMA (Ada margin kiri & atas agar tidak tertutup) */}
      <main className="ml-64 pt-16 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}