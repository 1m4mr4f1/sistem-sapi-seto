import { prisma } from '@/lib/prisma';

export async function getSuppliersPaginated(page: number = 1, itemsPerPage: number = 10) {
  try {
    const skip = (page - 1) * itemsPerPage;

    const [suppliers, totalSuppliers] = await Promise.all([
      prisma.supplier.findMany({
        take: itemsPerPage,
        skip: skip,
        orderBy: {
          supplier_name: 'asc',
        },
      }),
      prisma.supplier.count(),
    ]);

    return {
      suppliers,
      totalSuppliers,
      totalPages: Math.ceil(totalSuppliers / itemsPerPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data penyedia');
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: BigInt(id) },
    });
    return supplier;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}