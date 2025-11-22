import { getPurchaseById } from '@/app/lib/data/purchase.data';
import PurchasePrint from '@/app/components/dashboard/PurchasePrint';
import { notFound } from 'next/navigation';

interface PrintPageProps {
  params: {
    id: string;
  };
}

export default async function PurchasePrintPage({ params }: PrintPageProps) {
  // 1. Ambil data dari DB
  const purchase = await getPurchaseById(params.id);

  if (!purchase) {
    notFound();
  }

  // 2. Format data untuk dikirim ke komponen cetak
  const printData = {
    id: String(purchase.id),
    date: purchase.purchase_date,
    supplier: purchase.supplier.supplier_name,
    admin: purchase.user.name,
    total: Number(purchase.total_purchase),
    note: purchase.note,
    items: purchase.purchase_details.map(d => ({
      name: d.product ? d.product.product_name : 'Produk Dihapus',
      qty: Number(d.quantity),
      price: Number(d.price_at_purchase),
      total: Number(d.quantity) * Number(d.price_at_purchase)
    }))
  };

  // 3. Panggil komponen desain (PurchasePrint)
  return <PurchasePrint data={printData} />;
}