import ProductForm from '@/app/components/dashboard/ProductForm';
import { getProductById } from '@/app/lib/data/product.data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const id = params.id;
  const product = await getProductById(id);

  if (!product) {
    notFound(); // Akan menampilkan halaman 404 jika ID tidak ditemukan
  }

  // Serialize data (Convert BigInt & Decimal ke Number/String agar aman untuk Client Component)
  const serializedProduct = {
    id: String(product.id),
    product_name: product.product_name,
    stock: Number(product.stock),
    selling_price: Number(product.selling_price),
    last_purchase_price: product.last_purchase_price ? Number(product.last_purchase_price) : null,
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/products" 
          className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
        <p className="text-gray-500">Perbarui detail data produk daging.</p>
      </div>

      {/* Masukkan data ke form lewat prop initialData */}
      <ProductForm initialData={serializedProduct} />
    </div>
  );
}