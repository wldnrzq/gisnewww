# Development Plans: Web GIS Rumah Sakit Surabaya

## Roadmap Pengembangan

### Fase 1: Persiapan dan Perencanaan (2 minggu)
- [x] Analisis kebutuhan pengguna
- [x] Pembuatan desain UI/UX referensi
- [x] Pemilihan tech stack (Next.js, Tailwind CSS, ShadCN, MySQL)
- [x] Persiapan lingkungan pengembangan
- [ ] Setup repositori Git dan struktur proyek
- [ ] Perencanaan database dan API

### Fase 2: Pengembangan Frontend Dasar (3 minggu)
- [ ] Setup proyek Next.js dengan Tailwind CSS dan ShadCN
- [ ] Implementasi layout dasar (navbar, footer, struktur halaman)
- [ ] Pembuatan komponen UI reusable
- [ ] Implementasi halaman beranda
- [ ] Implementasi halaman daftar rumah sakit
- [ ] Implementasi halaman detail rumah sakit
- [ ] Responsive design untuk semua ukuran layar

### Fase 3: Integrasi GIS dan Database (4 minggu)
- [ ] Setup database MySQL dengan skema yang diperlukan
- [ ] Implementasi API untuk data rumah sakit dan layanan
- [ ] Integrasi Leaflet.js untuk fungsionalitas peta
- [ ] Implementasi fitur pencarian berdasarkan lokasi pengguna
- [ ] Implementasi fitur filter berdasarkan layanan rumah sakit
- [ ] Implementasi fitur menampilkan rumah sakit terdekat
- [ ] Optimasi query database untuk performa

### Fase 4: Admin Dashboard (2 minggu)
- [ ] Implementasi sistem autentikasi untuk admin
- [ ] Pembuatan halaman login admin
- [ ] Implementasi dashboard admin
- [ ] Fitur CRUD untuk data rumah sakit
- [ ] Fitur CRUD untuk data layanan
- [ ] Fitur upload dan manajemen gambar
- [ ] Implementasi validasi data

### Fase 5: Testing dan Optimasi (2 minggu)
- [ ] Unit testing untuk komponen dan fungsi utama
- [ ] Integration testing untuk alur pengguna
- [ ] Performance testing dan optimasi
- [ ] Cross-browser testing
- [ ] Responsive design testing
- [ ] Accessibility testing
- [ ] Security testing

### Fase 6: Deployment dan Finalisasi (1 minggu)
- [ ] Setup environment production
- [ ] Deployment aplikasi
- [ ] Konfigurasi domain dan SSL
- [ ] Monitoring dan logging
- [ ] Dokumentasi teknis
- [ ] User manual

## Prioritas Fitur

### Fitur Prioritas Tinggi (Must Have)
1. **Peta Interaktif Rumah Sakit**
   - Menampilkan lokasi rumah sakit di peta
   - Fitur zoom in/out dan pan
   - Marker rumah sakit dengan popup informasi dasar

2. **Pencarian Berdasarkan Lokasi Pengguna**
   - Deteksi lokasi pengguna (dengan izin)
   - Menampilkan rumah sakit terdekat dari lokasi pengguna
   - Mengurutkan hasil berdasarkan jarak

3. **Filter Berdasarkan Layanan**
   - Daftar layanan rumah sakit yang dapat dipilih
   - Filter multi-layanan
   - Hasil yang diperbarui secara real-time

4. **Daftar Rumah Sakit**
   - Tampilan daftar rumah sakit dengan informasi dasar
   - Sorting berdasarkan jarak, nama, atau rating
   - Pagination untuk hasil yang banyak

5. **Detail Rumah Sakit**
   - Informasi lengkap tentang rumah sakit
   - Daftar layanan yang tersedia
   - Informasi kontak dan jam operasional
   - Peta lokasi mini

### Fitur Prioritas Menengah (Should Have)
1. **Admin Dashboard**
   - Login sistem untuk admin
   - Manajemen data rumah sakit
   - Manajemen data layanan

2. **Pencarian Lanjutan**
   - Filter berdasarkan multiple kriteria
   - Pencarian berdasarkan nama rumah sakit
   - Filter berdasarkan rating

3. **Rute ke Rumah Sakit**
   - Petunjuk arah dari lokasi pengguna ke rumah sakit
   - Estimasi waktu tempuh
   - Opsi mode transportasi

### Fitur Prioritas Rendah (Nice to Have)
1. **Sistem Rating dan Review**
   - Pengguna dapat memberikan rating dan ulasan
   - Moderasi ulasan oleh admin
   - Tampilan rating rata-rata

2. **Bookmark Rumah Sakit Favorit**
   - Pengguna dapat menyimpan rumah sakit favorit
   - Akses cepat ke rumah sakit yang sering dikunjungi

3. **Notifikasi Ketersediaan Layanan**
   - Update real-time tentang ketersediaan layanan
   - Notifikasi perubahan jam operasional

4. **Mode Darurat**
   - Akses cepat ke rumah sakit terdekat dengan layanan UGD
   - Tombol panggilan darurat

## Struktur Data

### Tabel Rumah Sakit
```sql
CREATE TABLE hospitals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    operating_hours TEXT,
    description TEXT,
    image_url VARCHAR(255),
    rating DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Layanan
```sql
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Relasi Rumah Sakit - Layanan
```sql
CREATE TABLE hospital_services (
    hospital_id INT,
    service_id INT,
    PRIMARY KEY (hospital_id, service_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### Tabel Admin
```sql
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Tech Stack

### Frontend
- **Framework**: Next.js
- **CSS Framework**: Tailwind CSS
- **UI Library**: ShadCN
- **Map Library**: Leaflet.js
- **State Management**: React Context API / Redux Toolkit
- **Form Handling**: React Hook Form
- **Validasi**: Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: Next.js API Routes
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Upload**: multer / next-connect

### Development Tools
- **Package Manager**: npm / yarn
- **Version Control**: Git
- **Code Linting**: ESLint
- **Code Formatting**: Prettier
- **Testing**: Jest, React Testing Library
- **Development Server**: XAMPP (untuk MySQL)

## Estimasi Timeline

| Fase | Durasi | Tanggal Mulai | Tanggal Selesai |
|------|--------|---------------|-----------------|
| Fase 1: Persiapan | 2 minggu | 25 Mei 2025 | 8 Juni 2025 |
| Fase 2: Frontend Dasar | 3 minggu | 9 Juni 2025 | 29 Juni 2025 |
| Fase 3: GIS & Database | 4 minggu | 30 Juni 2025 | 27 Juli 2025 |
| Fase 4: Admin Dashboard | 2 minggu | 28 Juli 2025 | 10 Agustus 2025 |
| Fase 5: Testing & Optimasi | 2 minggu | 11 Agustus 2025 | 24 Agustus 2025 |
| Fase 6: Deployment | 1 minggu | 25 Agustus 2025 | 31 Agustus 2025 |

**Total Durasi Proyek**: 14 minggu (3.5 bulan)
