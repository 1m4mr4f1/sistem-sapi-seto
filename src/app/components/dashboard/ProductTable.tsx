// src/app/components/dashboard/ProductTable.tsx
'use client';

import { deleteProduct } from '@/app/lib/actions/product.actions';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Product = {
  id: string;
  product_name: string;
  stock: number;
  selling_price: number;
};

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');

  // 1. Effect untuk memunculkan Alert Sukses (Create & Edit)
  useEffect(() => {
    if (status === 'created') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk baru telah ditambahkan.',
        showConfirmButton: false,
        timer: 2000,
      });
      // Bersihkan URL agar alert tidak muncul lagi saat refresh
      router.replace('/dashboard/products');
    } else if (status === 'updated') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data produk telah diperbarui.',
        showConfirmButton: false,
        timer: 2000,
      });
      router.replace('/dashboard/products');
    }
  }, [status, router]);

  // 2. Fungsi Hapus dengan Konfirmasi SweetAlert
  const handleDelete = async (productId: string, productName: string) => {
    // Tampilkan konfirmasi
    const result = await Swal.fire({
      title: 'Yakin hapus data?',
      text: `Anda akan menghapus produk "${productName}". Data tidak bisa dikembalikan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      // Jika user klik Ya, panggil Server Action secara manual
      try {
        const formData = new FormData();
        formData.append('id', productId);

        await deleteProduct(formData);

        // Tampilkan pesan sukses terhapus
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data produk berhasil dihapus.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus data.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Nama Produk
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Stok (Kg)
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Harga Jual
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                Belum ada data produk. Silakan tambah produk baru.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {product.product_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {product.stock} Kg
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  Rp {product.selling_price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock > 0 ? 'Tersedia' : 'Habis'}
                  </span>
                </td>
                
                {/* Kolom Aksi */}
                <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="inline-flex text-blue-600 hover:text-blue-900 transition-colors items-center"
                    title="Edit Produk"
                  >
                    <Pencil size={18} />
                  </Link>

                  {/* Tombol Hapus (Sekarang pakai onClick handler) */}
                  <button
                    onClick={() => handleDelete(product.id, product.product_name)}
                    className="text-red-600 hover:text-red-900 transition-colors inline-flex items-center pt-1"
                    title="Hapus Produk"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}