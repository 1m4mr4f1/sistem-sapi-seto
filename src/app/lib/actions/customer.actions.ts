'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCustomer(formData: FormData) {
  const name = formData.get('customer_name') as string;
  const contact = formData.get('contact') as string;

  if (!name) {
    throw new Error('Nama pelanggan wajib diisi.');
  }

  await prisma.customer.create({
    data: {
      customer_name: name,
      contact: contact || null, // Simpan null jika kosong
    },
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers?status=created');
}

export async function updateCustomer(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('customer_name') as string;
  const contact = formData.get('contact') as string;

  if (!id || !name) {
    throw new Error('Data tidak valid.');
  }

  await prisma.customer.update({
    where: { id: BigInt(id) },
    data: {
      customer_name: name,
      contact: contact || null,
    },
  });

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers?status=updated');
}

export async function deleteCustomer(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) return;

  await prisma.customer.delete({
    where: { id: BigInt(id) },
  });

  revalidatePath('/dashboard/customers');
}