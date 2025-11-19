// src/app/lib/actions/product.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  // 1. Ambil data dari Form HTML
  const name = formData.get('product_name') as string;
  const stock = Number(formData.get('stock'));
  const selling_price = Number(formData.get('selling_price'));
  const last_purchase_price = Number(formData.get('last_purchase_price'));

  // 2. Validasi Sederhana
  if (!name || stock < 0 || selling_price < 0) {
    throw new Error('Data tidak valid. Pastikan nama diisi dan angka positif.');
  }

  // 3. Simpan ke Database (Prisma)
  await prisma.product.create({
    data: {
      product_name: name,
      stock: stock,
      selling_price: selling_price,
      last_purchase_price: last_purchase_price || 0,
    },
  });

  // 4. Refresh halaman daftar produk agar data baru muncul
  revalidatePath('/dashboard/products');

  // 5. Kembali ke halaman list
  redirect('/dashboard/products');
}