'use client';

import { createSupplier, updateSupplier } from '@/app/lib/actions/supplier.actions';
import { Save, X } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

type SupplierData = {
  id?: string;
  supplier_name: string;
  contact?: string | null;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
    >
      <Save size={18} />
      {pending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Penyedia'}
    </button>
  );
}

export default function SupplierForm({ initialData }: { initialData?: SupplierData }) {
  const action = initialData ? updateSupplier : createSupplier;
  const isEdit = !!initialData;

  return (
    <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full">
      {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

      <div className="space-y-6">
        {/* Nama Penyedia */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Nama Penyedia (Supplier)
          </label>
          <input
            type="text"
            name="supplier_name"
            required
            defaultValue={initialData?.supplier_name}
            placeholder="Contoh: PT. Daging Segar Sejahtera"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Kontak */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Kontak / No. HP (Opsional)
          </label>
          <input
            type="text"
            name="contact"
            defaultValue={initialData?.contact || ''}
            placeholder="Contoh: 08123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
        <SubmitButton isEdit={isEdit} />
        <Link 
          href="/dashboard/suppliers"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-semibold transition-colors border border-gray-300"
        >
          <X size={18} /> Batal
        </Link>
      </div>
    </form>
  );
}