# 🥩 Sistem Manajemen Toko Daging — **Sapi Seto POS & Inventory**

Sistem informasi manajemen toko (Point of Sales & Inventory) berbasis web modern yang dibangun khusus untuk toko daging **Sapi Seto**. Aplikasi ini mendukung seluruh siklus operasional — mulai dari pembelian stok, manajemen gudang, penjualan kasir, hingga laporan keuangan secara real-time.

---

## 👤 Akun Demo (Default Seed)

Jika menggunakan data seed bawaan, Anda dapat login dengan akun berikut:

```
Username: admin
Password: password123
```

---

## 🚀 Fitur Utama

### 1. 📦 Manajemen Stok (Inventory)

* CRUD Produk (Nama, Stok, Harga Jual)
* Stok otomatis berkurang saat penjualan & bertambah saat pembelian
* Mendukung stok desimal (misal 1.5 Kg)
* Notifikasi stok menipis di dashboard

### 2. 🛒 Kasir & Penjualan (Point of Sales)

* Input transaksi cepat dengan keranjang interaktif
* Harga fleksibel (bisa diedit untuk tawar-menawar)
* Cetak struk (A4 atau thermal)
* Status pembayaran: **Lunas**, **Hutang**, **Cicilan**

### 3. 🚚 Pembelian & Supplier (Restock)

* Input barang masuk dari supplier
* HPP otomatis dari harga beli terakhir
* Manajemen hutang ke supplier

### 4. 📊 Laporan & Analitik

* Dashboard performa toko (omzet, laba, statistik harian)
* Laporan penjualan berdasarkan tanggal
* Laporan laba kotor & laba bersih
* Laporan hutang pelanggan & supplier

---

## 📂 Struktur Database & Skrip

* **Schema Prisma:** `prisma/schema.prisma`
* **Data Seed:** `prisma/betadata.seed.ts`
* **Backup/Skrip SQL:** folder `@/scripts/`

---

## 🛠️ Teknologi yang Digunakan

* **Framework:** Next.js 14 (App Router)
* **Bahasa:** TypeScript
* **Database:** MySQL
* **ORM:** Prisma
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Alerts:** SweetAlert2
* **Keamanan:** Bcrypt (Password Hashing)

---

## ⚙️ Cara Instalasi & Menjalankan Proyek

### **Prasyarat**

* Node.js v18+
* MySQL Server (XAMPP, Laragon, Docker, dll)

### 1. **Clone Repositori**

```bash
git clone https://github.com/username-anda/sistem-sapi-seto.git
cd sistem-sapi-seto
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Konfigurasi Environment**

Buat file `.env` di root:

```
DATABASE_URL="mysql://root:@localhost:3306/db_sistem_sapi_seto"
```

### 4. **Migrasi & Seeding Database**

```bash
npx prisma migrate reset
```

### 5. **Jalankan Server Development**

```bash
npm run dev
```

Akses: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Tentang Next.js

File utama dapat diedit di:

```
app/page.tsx
```

Dokumentasi:

* Next.js Docs
* Learn Next.js

---

## 🚀 Deploy ke Vercel

Gunakan platform Vercel untuk deployment.

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan **portofolio** dan **manajemen bisnis pribadi**. Copyright © 2025 — **Sapi Seto System**.
