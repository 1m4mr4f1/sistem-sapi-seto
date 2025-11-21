import { prisma } from '@/lib/prisma';

export async function getSalesPaginated(page: number = 1, itemsPerPage: number = 10) {
  try {
    const skip = (page - 1) * itemsPerPage;

    const [sales, totalSales] = await Promise.all([
      prisma.sale.findMany({
        take: itemsPerPage,
        skip: skip,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          customer: true,
          user: true,
          // TAMBAHAN PENTING: Ambil detail barang & nama produknya
          sale_details: {
            include: {
              product: true 
            }
          }
        },
      }),
      prisma.sale.count(),
    ]);

    return {
      sales,
      totalSales,
      totalPages: Math.ceil(totalSales / itemsPerPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data penjualan');
  }

  
}