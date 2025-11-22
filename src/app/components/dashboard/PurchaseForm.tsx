'use client';

import { useState } from 'react';
import { createPurchase } from '@/app/lib/actions/purchase.actions';
import { Plus, Trash2, ShoppingBag, Save } from 'lucide-react';
import Swal from 'sweetalert2';

type Supplier = { id: string; supplier_name: string };
type Product = { id: string; product_name: string; last_purchase_price: number | null };

interface PurchaseFormProps {
  suppliers: Supplier[];
  products: Product[];
}

type CartItem = {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number; // Harga beli satuan
};

export default function PurchaseForm({ suppliers, products }: PurchaseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [supplierId, setSupplierId] = useState<string>('');
  const [note, setNote] = useState('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // Helper
  const amountPaidValue = amountPaid === '' ? 0 : amountPaid;
  const totalTagihan = cart.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
  const sisaTagihan = totalTagihan - amountPaidValue;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      Swal.fire('Info', 'Produk sudah ada di list.', 'info');
      return;
    }

    setCart([...cart, {
      productId: product.id,
      productName: product.product_name,
      quantity: 1,
      // Default harga beli ambil dari history terakhir, kalau null jadi 0
      costPrice: Number(product.last_purchase_price) || 0 
    }]);
    setSelectedProduct('');
  };

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleUpdateItem = (index: number, field: 'quantity' | 'costPrice', valueStr: string) => {
    const newCart = [...cart];
    let value = valueStr === '' ? 0 : Number(valueStr);

    if (field === 'quantity') {
      value = Math.floor(value); // Wajib Integer
    }

    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  const handleSubmit = async () => {
    if (!supplierId) {
      Swal.fire('Error', 'Pilih Supplier dulu!', 'error');
      return;
    }
    if (cart.length === 0) {
      Swal.fire('Error', 'Keranjang kosong!', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await createPurchase(supplierId, new Date(), cart, amountPaidValue, note);
      Swal.fire('Sukses', 'Pembelian berhasil disimpan. Stok bertambah!', 'success');
    } catch (error: any) {
      Swal.fire('Gagal', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* KIRI: Form & Cart */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Header Transaksi */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Supplier</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">-- Pilih Supplier --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">No. Nota Supplier / Catatan</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              placeholder="Contoh: INV-ABC-001"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Keranjang Belanja */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
          <div className="flex items-end gap-4 mb-6 border-b pb-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Produk (Restock)</label>
              <select 
                className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- Cari Produk --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>
            </div>
            <button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50" disabled={!selectedProduct}>
              <Plus size={20} /> Tambah
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-orange-50 text-orange-800 text-xs uppercase font-bold">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3 w-24">Qty Masuk</th>
                  <th className="p-3 w-36">Harga Beli (@)</th>
                  <th className="p-3 w-32">Subtotal</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Belum ada barang yang dipilih.</td></tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={item.productId}>
                      <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                      <td className="p-3">
                        <input type="number" min="1" className="w-full p-1 border rounded text-center bg-white text-gray-900" value={item.quantity} onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)} />
                      </td>
                      <td className="p-3">
                        <input type="number" className="w-full p-1 border rounded text-right bg-white text-gray-900" value={item.costPrice} onChange={(e) => handleUpdateItem(index, 'costPrice', e.target.value)} />
                      </td>
                      <td className="p-3 text-right font-semibold text-gray-900">{(item.quantity * item.costPrice).toLocaleString('id-ID')}</td>
                      <td className="p-3 text-center"><button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* KANAN: Kalkulator */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit sticky top-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag /> Total Tagihan</h2>
        
        <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
          <span>Total</span>
          <span>Rp {totalTagihan.toLocaleString('id-ID')}</span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Bayar Ke Supplier (DP/Lunas)</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-bold">Rp</span>
            <input 
              type="number" 
              className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg text-lg font-bold bg-white text-gray-900 placeholder:text-gray-300"
              placeholder="0"
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))} 
            />
          </div>
          
          <div className={`mt-3 text-sm font-bold p-3 rounded text-center ${sisaTagihan <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {sisaTagihan <= 0 
              ? 'STATUS: LUNAS' 
              : `SISA HUTANG: Rp ${sisaTagihan.toLocaleString('id-ID')}`
            }
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isLoading || cart.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
          {isLoading ? 'Menyimpan...' : <><Save size={20} /> Simpan Pembelian</>}
        </button>
      </div>

    </div>
  );
}