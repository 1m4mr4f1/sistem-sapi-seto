// src/app/components/dashboard/SaleForm.tsx
'use client';

import { useState } from 'react';
import { createSale } from '@/app/lib/actions/sale.actions';
import { Plus, Trash2, ShoppingCart, Save } from 'lucide-react';
import Swal from 'sweetalert2';

type Product = { id: string; product_name: string; stock: number; selling_price: number };
type Customer = { id: string; customer_name: string };

interface SaleFormProps {
  products: Product[];
  customers: Customer[];
}

type CartItem = {
  productId: string;
  productName: string;
  stockAvailable: number;
  quantity: number;
  price: number;
};

export default function SaleForm({ products, customers }: SaleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  // PERBAIKAN: State tipe number tapi default string kosong '' agar input bersih
  const [discount, setDiscount] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');

  // Helper: Ambil nilai angka asli untuk perhitungan (kalau kosong anggap 0)
  const discountValue = discount === '' ? 0 : discount;
  const amountPaidValue = amountPaid === '' ? 0 : amountPaid;

  // Hitung Total Otomatis
  const subTotal = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const finalTotal = Math.max(0, subTotal - discountValue);
  const change = amountPaidValue - finalTotal;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      Swal.fire('Info', 'Produk sudah ada di keranjang.', 'info');
      return;
    }
    if (product.stock <= 0) {
      Swal.fire('Stok Habis', 'Stok produk ini 0.', 'error');
      return;
    }

    setCart([...cart, {
      productId: product.id,
      productName: product.product_name,
      stockAvailable: product.stock,
      quantity: 1,
      price: product.selling_price
    }]);
    setSelectedProduct('');
  };

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleUpdateItem = (index: number, field: 'quantity' | 'price', valueStr: string) => {
    const newCart = [...cart];
    
    // Jika user hapus semua angka, biarkan string kosong sementara di UI table
    // Tapi karena di table logicnya agak beda (wajib ada angka), kita force jadi 0 kalau kosong
    let value = valueStr === '' ? 0 : Number(valueStr);

    if (field === 'quantity') {
      if (value > newCart[index].stockAvailable) {
        Swal.fire('Stok Kurang', `Sisa stok hanya ${newCart[index].stockAvailable}`, 'warning');
        value = newCart[index].stockAvailable;
      }
      value = Math.floor(value);
    }

    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  // SECURITY: Fungsi untuk mencegah input karakter non-angka (e, +, -, titik) pada field number
  const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      Swal.fire('Gagal', 'Keranjang kosong!', 'error');
      return;
    }
    try {
      setIsLoading(true);
      // Kirim value asli (number) ke server
      await createSale(
        selectedCustomerId || null, 
        new Date(), 
        cart, 
        discountValue, 
        amountPaidValue
      );
      Swal.fire('Sukses', 'Transaksi disimpan!', 'success');
      
      // Reset Form
      setCart([]);
      setDiscount('');
      setAmountPaid('');
      setSelectedCustomerId('');
    } catch (error: any) {
      Swal.fire('Gagal', error.message, 'error');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Pilih Pelanggan */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Pelanggan</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">-- Pelanggan Umum --</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
          </select>
        </div>

        {/* Pilih Produk */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
          <div className="flex items-end gap-4 mb-6 border-b pb-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tambah Produk</label>
              <select 
                className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">-- Pilih Produk --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>{p.product_name} (Sisa: {p.stock})</option>
                ))}
              </select>
            </div>
            <button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg flex items-center gap-2 font-semibold disabled:opacity-50" disabled={!selectedProduct}>
              <Plus size={20} /> Tambah
            </button>
          </div>

          {/* Tabel Keranjang */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3 w-24">Qty (Int)</th>
                  <th className="p-3 w-32">Harga</th>
                  <th className="p-3 w-32">Total</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Keranjang kosong.</td></tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={item.productId}>
                      <td className="p-3 font-medium text-gray-800">{item.productName}</td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          min="1" 
                          step="1"
                          onKeyDown={preventInvalidInput} // Secure input
                          className="w-full p-1 border rounded text-center text-gray-900 bg-white" 
                          value={item.quantity} 
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)} 
                        />
                      </td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          onKeyDown={preventInvalidInput} // Secure input
                          className="w-full p-1 border rounded text-right text-gray-900 bg-white" 
                          value={item.price} 
                          onChange={(e) => handleUpdateItem(index, 'price', e.target.value)} 
                        />
                      </td>
                      <td className="p-3 text-right font-semibold text-gray-900">{(item.quantity * item.price).toLocaleString('id-ID')}</td>
                      <td className="p-3 text-center"><button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bagian Pembayaran */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit sticky top-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingCart /> Ringkasan</h2>
        <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rp {subTotal.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Diskon</span>
            <div className="flex items-center w-32">
              <span className="bg-gray-100 p-2 border border-r-0 rounded-l text-xs">Rp</span>
              <input 
                type="number" 
                placeholder="0"
                min="0"
                onKeyDown={preventInvalidInput} // Secure
                className="w-full p-1 border rounded-r text-right text-sm text-gray-900 bg-white placeholder:text-gray-300" 
                value={discount} 
                onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))} 
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-900 mb-6"><span>Total</span><span>Rp {finalTotal.toLocaleString('id-ID')}</span></div>
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Bayar (Uang Diterima)</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-bold">Rp</span>
            <input 
              type="number" 
              placeholder="0"
              min="0"
              onKeyDown={preventInvalidInput} // Secure
              className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 bg-white placeholder:text-gray-300" 
              value={amountPaid} 
              onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))} 
            />
          </div>
          <div className={`mt-3 text-sm font-bold p-2 rounded text-center ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{change >= 0 ? `Kembalian: Rp ${change.toLocaleString('id-ID')}` : `Kurang: Rp ${Math.abs(change).toLocaleString('id-ID')}`}</div>
        </div>
        <button onClick={handleSubmit} disabled={isLoading || cart.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">{isLoading ? 'Memproses...' : <><Save size={20} /> Simpan Transaksi</>}</button>
      </div>
    </div>
  );
}