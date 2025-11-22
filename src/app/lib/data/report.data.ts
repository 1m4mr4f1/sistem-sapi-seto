import { prisma } from '@/lib/prisma';

type ReportParams = {
  startDate: Date;
  endDate: Date;
};

// ==========================================
// 1. LAPORAN PENJUALAN (SALES REPORT)
// ==========================================
export async function getSalesReport({ startDate, endDate }: ReportParams) {
  try {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await prisma.sale.findMany({
      where: {
        sale_date: {
          gte: startDate,
          lte: endOfDay,
        },
      },
      orderBy: {
        sale_date: 'desc',
      },
      include: {
        customer: true,
        user: true,
      }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.final_total), 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + Number(sale.discount), 0);
    const totalTransactions = sales.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      summary: {
        totalRevenue,
        totalDiscount,
        totalTransactions,
        averageTransaction
      },
      sales
    };

  } catch (error) {
    console.error('Sales Report Error:', error);
    throw new Error('Gagal memuat laporan penjualan');
  }
}

// ==========================================
// 2. LAPORAN KEUANGAN (FINANCIAL REPORT)
// ==========================================
export async function getFinancialReport({ startDate, endDate }: ReportParams) {
  try {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Ambil Data Penjualan (Lunas Only)
    const sales = await prisma.sale.findMany({
      where: {
        sale_date: { gte: startDate, lte: endOfDay },
        payment_status: 'paid',
      },
      include: {
        sale_details: {
          include: { product: true }
        }
      }
    });

    // 2. Ambil Pengeluaran Operasional
    const expenses = await prisma.expense.findMany({
      where: {
        expense_date: { gte: startDate, lte: endOfDay }
      },
      orderBy: { expense_date: 'desc' },
      include: { user: true }
    });

    // 3. Ambil Pembelian Stok (Cash Out)
    const purchases = await prisma.purchase.findMany({
      where: {
        purchase_date: { gte: startDate, lte: endOfDay },
        payment_status: 'paid'
      }
    });

    // --- PERHITUNGAN ---
    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.final_total), 0);
    const totalOperationalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRestockCost = purchases.reduce((sum, p) => sum + Number(p.total_purchase), 0);

    // Hitung Laba Kotor (Gross Profit)
    let totalGrossProfit = 0;
    sales.forEach(sale => {
      sale.sale_details.forEach(detail => {
        const qty = Number(detail.quantity);
        const sellingPrice = Number(detail.price_at_sale);
        const buyingPrice = detail.product?.last_purchase_price ? Number(detail.product.last_purchase_price) : 0;
        
        totalGrossProfit += (sellingPrice - buyingPrice) * qty;
      });
    });

    // Hitung Laba Bersih (Net Profit)
    const netProfit = totalGrossProfit - totalOperationalExpense;

    return {
      summary: {
        totalRevenue,
        totalOperationalExpense,
        totalRestockCost,
        totalGrossProfit,
        netProfit
      },
      expenses,
    };

  } catch (error) {
    console.error('Financial Report Error:', error);
    throw new Error('Gagal memuat laporan keuangan');
  }
}

// ==========================================
// 3. LAPORAN STOK GUDANG (INVENTORY REPORT)
// ==========================================
export async function getInventoryReport() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { stock: 'asc' }
    });

    let totalStockItems = 0;
    let totalAssetValue = 0;
    let lowStockCount = 0;
    const LOW_STOCK_THRESHOLD = 10;

    const inventory = products.map(p => {
      const stock = Number(p.stock);
      const lastBuyPrice = Number(p.last_purchase_price) || 0;
      const assetValue = stock * lastBuyPrice;

      totalStockItems += stock;
      totalAssetValue += assetValue;

      if (stock > 0 && stock < LOW_STOCK_THRESHOLD) {
        lowStockCount++;
      }

      return {
        id: String(p.id),
        product_name: p.product_name,
        stock,
        last_purchase_price: lastBuyPrice,
        asset_value: assetValue,
        status: stock === 0 ? 'Habis' : (stock < LOW_STOCK_THRESHOLD ? 'Menipis' : 'Aman')
      };
    });

    return {
      summary: {
        totalProducts: products.length,
        totalStockItems,
        totalAssetValue,
        lowStockCount
      },
      inventory
    };

  } catch (error) {
    console.error('Inventory Report Error:', error);
    throw new Error('Gagal memuat laporan stok');
  }
}

// ==========================================
// 4. LAPORAN HUTANG & PIUTANG (DEBT REPORT)
// ==========================================
export async function getDebtReport() {
  try {
    // PIUTANG (Receivables - Pelanggan belum bayar)
    const receivables = await prisma.sale.findMany({
      where: { payment_status: { not: 'paid' } },
      orderBy: { sale_date: 'desc' },
      include: {
        customer: true,
        payment_receivables: true 
      }
    });

    // HUTANG (Payables - Kita belum bayar Supplier)
    const payables = await prisma.purchase.findMany({
      where: { payment_status: { not: 'paid' } },
      orderBy: { purchase_date: 'desc' },
      include: {
        supplier: true,
        payment_payables: true
      }
    });

    // Format Data Piutang
    const receivableList = receivables.map(sale => {
      const total = Number(sale.final_total);
      const paid = sale.payment_receivables.reduce((sum, p) => sum + Number(p.amount_paid), 0);
      const remaining = total - paid;

      return {
        id: String(sale.id),
        date: sale.sale_date,
        party_name: sale.customer ? sale.customer.customer_name : 'Pelanggan Umum',
        contact: sale.customer?.contact || '-',
        total,
        paid,
        remaining,
        status: sale.payment_status
      };
    });

    // Format Data Hutang
    const payableList = payables.map(purchase => {
      const total = Number(purchase.total_purchase);
      const paid = purchase.payment_payables.reduce((sum, p) => sum + Number(p.amount_paid), 0);
      const remaining = total - paid;

      return {
        id: String(purchase.id),
        date: purchase.purchase_date,
        party_name: purchase.supplier.supplier_name,
        contact: purchase.supplier.contact || '-',
        total,
        paid,
        remaining,
        status: purchase.payment_status
      };
    });

    const summary = {
      totalReceivable: receivableList.reduce((sum, item) => sum + item.remaining, 0),
      totalPayable: payableList.reduce((sum, item) => sum + item.remaining, 0)
    };

    return {
      summary,
      receivableList,
      payableList
    };

  } catch (error) {
    console.error('Debt Report Error:', error);
    throw new Error('Gagal memuat laporan hutang piutang');
  }
}