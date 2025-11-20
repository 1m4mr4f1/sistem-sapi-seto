// src/app/lib/data/product.data.ts
import { prisma } from '@/lib/prisma';

export async function getProducts() {
  try {
    // Mengambil semua produk, diurutkan dari stok paling sedikit
    const products = await prisma.product.findMany({
      orderBy: {
        stock: 'asc', 
      },
    });
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data produk');
  }
}

// Function baru untuk pagination
export async function getProductsPaginated(page: number = 1, itemsPerPage: number = 10) {
  try {
    const skip = (page - 1) * itemsPerPage;

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        take: itemsPerPage,
        skip: skip,
        orderBy: {
          stock: 'asc',
        },
      }),
      prisma.product.count(),
    ]);

    return {
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / itemsPerPage),
      currentPage: page,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data produk');
  }
} // <--- PERBAIKAN: Kurung kurawal penutup ditambahkan di sini

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(id) },
    });
    return product;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}