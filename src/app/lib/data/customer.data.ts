import { prisma } from '@/lib/prisma';

// Ambil data dengan pagination untuk tabel
export async function getCustomersPaginated(page: number = 1, itemsPerPage: number = 10) {
  try {
    const skip = (page - 1) * itemsPerPage;

    const [customers, totalCustomers] = await Promise.all([
      prisma.customer.findMany({
        take: itemsPerPage,
        skip: skip,
        orderBy: {
          customer_name: 'asc', // Urutkan berdasarkan nama A-Z
        },
      }),
      prisma.customer.count(),
    ]);

    return {
      customers,
      totalCustomers,
      totalPages: Math.ceil(totalCustomers / itemsPerPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data pelanggan');
  }
}

// Ambil 1 data untuk Edit
export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: BigInt(id) },
    });
    return customer;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}