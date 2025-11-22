import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  try {
    const [
      totalProduk,
      totalCustomer,
      salesData,
      purchaseData,
      expenseData,
      recentSales,
      lowStockProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      // Omzet
      prisma.sale.aggregate({
        _sum: { final_total: true },
        _count: { id: true }
      }),
      // Pembelian Stok
      prisma.purchase.aggregate({
        _sum: { total_purchase: true }
      }),
      // Operasional
      prisma.expense.aggregate({
        _sum: { amount: true }
      }),
      // 5 Transaksi Terakhir
      prisma.sale.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: { customer: true, user: true }
      }),
      // Stok Menipis
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        take: 5,
        orderBy: { stock: 'asc' }
      })
    ]);

    // Kalkulasi
    const totalRevenue = Number(salesData._sum.final_total) || 0;
    const totalPurchaseCost = Number(purchaseData._sum.total_purchase) || 0;
    const totalExpense = Number(expenseData._sum.amount) || 0;
    const totalOutcome = totalPurchaseCost + totalExpense;
    const netProfit = totalRevenue - totalOutcome;

    return {
      summary: {
        totalProduk,
        totalCustomer,
        totalTransaction: salesData._count.id,
        totalRevenue,
        totalOutcome,
        totalPurchaseCost,
        totalExpense,
        netProfit
      },
      recentSales,
      lowStockProducts
    };
  } catch (error) {
    console.error('Dashboard Data Error:', error);
    throw new Error('Gagal memuat data dashboard');
  }
}