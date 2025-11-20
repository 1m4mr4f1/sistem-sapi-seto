'use client';

import { deleteSupplier } from '@/app/lib/actions/supplier.actions';
import { Pencil, Trash2, Phone, Truck } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Supplier = {
  id: string;
  supplier_name: string;
  contact: string | null;
};

interface SupplierTableProps {
  suppliers: Supplier[];
}

export default function SupplierTable({ suppliers }: SupplierTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'created') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Penyedia baru ditambahkan.',
        showConfirmButton: false,
        timer: 2000,
      });
      router.replace('/dashboard/suppliers');
    } else if (status === 'updated') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data penyedia diperbarui.',
        showConfirmButton: false,
        timer: 2000,
      });
      router.replace('/dashboard/suppliers');
    }
  }, [status, router]);

  const handleDelete = async (supplierId: string, supplierName: string) => {
    const result = await Swal.fire({
      title: 'Yakin hapus data?',
      text: `Anda akan menghapus penyedia "${supplierName}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append('id', supplierId);
        await deleteSupplier(formData);
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Data penyedia berhasil dihapus.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menghapus data.',
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
              Nama Penyedia
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Kontak / HP
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                Belum ada data penyedia.
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium flex items-center gap-2">
                  <Truck size={16} className="text-gray-400" />
                  {supplier.supplier_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {supplier.contact || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/suppliers/${supplier.id}/edit`}
                    className="inline-flex text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(supplier.id, supplier.supplier_name)}
                    className="text-red-600 hover:text-red-900 transition-colors inline-flex items-center pt-1"
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