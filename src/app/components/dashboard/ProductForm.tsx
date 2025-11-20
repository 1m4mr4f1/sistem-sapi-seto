// src/app/components/dashboard/ProductForm.tsx
'use client';

import { createProduct, updateProduct } from '@/app/lib/actions/product.actions';
import { Save, X } from 'lucide-react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

// Definisi tipe data untuk inisialisasi form (saat edit)
type ProductData = {
  id?: string;
  product_name: string;
  stock: number;
  selling_price: number;
  last_purchase_price?: number | null;
};

// Button Component dipisah agar bisa pakai useFormStatus
function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      <Save size={18} />
      {pending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
    </button>
  );
}

export default function ProductForm({ initialData }: { initialData?: ProductData }) {
  // Tentukan Action: Jika ada initialData maka Update, jika tidak maka Create
  const action = initialData ? updateProduct : createProduct;
  const isEdit = !!initialData;

  return (
    <form action={action} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full">
      {/* Hidden Input ID: Wajib ada saat mode Edit agar server tahu ID mana yang diupdate */}
      {isEdit && <input type="hidden" name="id" value={initialData?.id} />}

      <div className="space-y-6">
        
        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Nama Produk Daging
          </label>
          <input
            type="text"
            name="product_name"
            required
            defaultValue={initialData?.product_name}
            placeholder="Contoh: Daging Has Dalam (Tenderloin)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
          />
        </div>

        {/* Stok */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Stok (Kg)
          </label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            step="0.01"
            defaultValue={initialData?.stock}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Harga Jual */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Harga Jual (Per Kg)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-600 font-medium z-10">
                Rp
              </span>
              <input
                type="number"
                name="selling_price"
                required
                min="0"
                step="100"
                defaultValue={initialData?.selling_price}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>
          </div>

          {/* Harga Beli Terakhir */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Harga Beli (Estimasi)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-600 font-medium z-10">
                Rp
              </span>
              <input
                type="number"
                name="last_purchase_price"
                min="0"
                step="100"
                defaultValue={initialData?.last_purchase_price || ''}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400 bg-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              *Opsional, untuk referensi laba
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
        <SubmitButton isEdit={isEdit} />
        <Link 
          href="/dashboard/products"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-semibold transition-colors border border-gray-300"
        >
          <X size={18} />
          Batal
        </Link>
      </div>
    </form>
  );
}