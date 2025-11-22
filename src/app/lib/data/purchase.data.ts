import { prisma } from '@/lib/prisma';

// Fungsi 1: Ambil List Pembelian untuk Tabel (Paginated)
export async function getPurchasesPaginated(page: number = 1, itemsPerPage: number = 10) {
  try {
    const skip = (page - 1) * itemsPerPage;

    const [purchases, totalPurchases] = await Promise.all([
      prisma.purchase.findMany({
        take: itemsPerPage,
        skip: skip,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          supplier: true,
          user: true,
          // TAMBAHAN PENTING: Include detail barang untuk keperluan Modal View
          purchase_details: {
            include: {
              product: true
            }
          }
        },
      }),
      prisma.purchase.count(),
    ]);

    return {
      purchases,
      totalPurchases,
      totalPages: Math.ceil(totalPurchases / itemsPerPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data pembelian');
  }
}

// Fungsi 2: Ambil 1 Data Pembelian Lengkap (Untuk Halaman Print & Modal)
export async function getPurchaseById(id: string) {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: BigInt(id) },
      include: {
        supplier: true,
        user: true,
        purchase_details: {
          include: {
            product: true
          }
        }
      }
    });
    return purchase;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}