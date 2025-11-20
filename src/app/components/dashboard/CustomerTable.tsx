'use client';

import { deleteCustomer } from '@/app/lib/actions/customer.actions';
import { Pencil, Trash2, Phone } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Customer = {
  id: string;
  customer_name: string;
  contact: string | null;
};

interface CustomerTableProps {
  customers: Customer[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status');

  // Effect untuk SweetAlert Sukses
  useEffect(() => {
    if (status === 'created') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pelanggan baru ditambahkan.',
        showConfirmButton: false,
        timer: 2000,
      });
      router.replace('/dashboard/customers');
    } else if (status === 'updated') {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pelanggan diperbarui.',
        showConfirmButton: false,
        timer: 2000,
      });
      router.replace('/dashboard/customers');
    }
  }, [status, router]);

  // Fungsi Delete dengan SweetAlert
  const handleDelete = async (customerId: string, customerName: string) => {
    const result = await Swal.fire({
      title: 'Yakin hapus data?',
      text: `Anda akan menghapus pelanggan "${customerName}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append('id', customerId);
      await deleteCustomer(formData);
      
      Swal.fire({
        title: 'Terhapus!',
        text: 'Data pelanggan berhasil dihapus.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Nama Pelanggan
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
          {customers.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                Belum ada data pelanggan.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {customer.customer_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {customer.contact || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/dashboard/customers/${customer.id}/edit`}
                    className="inline-flex text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(customer.id, customer.customer_name)}
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