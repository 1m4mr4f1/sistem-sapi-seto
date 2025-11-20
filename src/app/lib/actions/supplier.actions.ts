'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSupplier(formData: FormData) {
  const name = formData.get('supplier_name') as string;
  const contact = formData.get('contact') as string;

  if (!name) {
    throw new Error('Nama penyedia wajib diisi.');
  }

  await prisma.supplier.create({
    data: {
      supplier_name: name,
      contact: contact || null,
    },
  });

  revalidatePath('/dashboard/suppliers');
  redirect('/dashboard/suppliers?status=created');
}

export async function updateSupplier(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('supplier_name') as string;
  const contact = formData.get('contact') as string;

  if (!id || !name) {
    throw new Error('Data tidak valid.');
  }

  await prisma.supplier.update({
    where: { id: BigInt(id) },
    data: {
      supplier_name: name,
      contact: contact || null,
    },
  });

  revalidatePath('/dashboard/suppliers');
  redirect('/dashboard/suppliers?status=updated');
}

export async function deleteSupplier(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) return;

  await prisma.supplier.delete({
    where: { id: BigInt(id) },
  });

  revalidatePath('/dashboard/suppliers');
}