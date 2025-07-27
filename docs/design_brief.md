# Design Brief: Web GIS Rumah Sakit Surabaya

## Identitas Visual

### Warna Utama
Berdasarkan referensi HTML/CSS yang telah dibuat, aplikasi akan menggunakan skema warna berikut:
- **Warna Primer**: #3B82F6 (Biru)
- **Warna Sekunder**: #1E40AF (Biru Gelap)
- **Warna Aksen**: #EFF6FF (Biru Sangat Terang)
- **Warna Latar**: #F9FAFB (Abu-abu Sangat Terang)
- **Warna Teks Utama**: #1F2937 (Abu-abu Gelap)
- **Warna Teks Sekunder**: #4B5563 (Abu-abu Medium)
- **Warna Border**: #E5E7EB (Abu-abu Terang)

### Tipografi
- **Font Utama**: 'Poppins', sans-serif
- **Ukuran Font**:
  - Heading 1: 32px (font-weight: 700)
  - Heading 2: 24px (font-weight: 600)
  - Heading 3: 20px (font-weight: 600)
  - Body Text: 16px (font-weight: 400)
  - Small Text: 14px (font-weight: 400)
- **Line Height**: 1.6 untuk teks paragraf

### Iconografi
- Menggunakan Font Awesome 6 untuk ikon
- Ikon harus konsisten dalam gaya dan ukuran
- Ukuran ikon standar: 16px-24px

## Elemen UI

### Navigasi
- **Navbar**: Fixed top navigation dengan logo di kiri, search bar di tengah, dan kontrol pengguna di kanan
- **Menu Bar**: Horizontal menu di bawah navbar dengan highlight untuk halaman aktif
- **Mobile Menu**: Menu hamburger untuk tampilan mobile yang menampilkan menu vertikal saat diklik

### Tombol
- **Tombol Primer**: Background biru (#3B82F6), teks putih, border radius 8px, padding 12px 24px
- **Tombol Sekunder**: Background putih, border biru, teks biru, border radius 8px, padding 12px 24px
- **Tombol Aksi Kecil**: Background abu-abu terang, border radius 20px, padding 6px 12px

### Kartu (Cards)
- Background putih
- Border radius 12px
- Shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
- Padding: 24px
- Margin bottom: 24px

### Input Form
- Border radius: 8px
- Border: 1px solid #D1D5DB
- Padding: 12px 16px
- Focus state: Border biru dengan shadow biru transparan

### Peta GIS
- Container dengan border radius 12px
- Controls di pojok kanan atas
- Marker rumah sakit menggunakan ikon khusus dengan warna yang berbeda berdasarkan kategori
- Popup info saat marker diklik dengan style yang konsisten dengan UI

## Prinsip UX

### Layout
- **Grid System**: 12-column grid untuk desktop
- **Spacing**: Menggunakan kelipatan 4px untuk spacing (4px, 8px, 16px, 24px, 32px, 48px, 64px, 80px)
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 768px
  - Laptop: 768px - 1024px
  - Desktop: > 1024px

### Interaksi
- Transisi halus (0.3s) untuk hover dan interaksi lainnya
- Feedback visual saat elemen diinteraksi (hover, active, focus)
- Loading state yang jelas saat data sedang diambil
- Animasi subtle menggunakan Animate.css untuk elemen yang muncul

### Aksesibilitas
- Kontras warna yang memenuhi standar WCAG 2.1 AA
- Teks alternatif untuk semua gambar
- Keyboard navigable untuk semua interaksi
- Pesan error yang jelas dan deskriptif

## Halaman Utama

### Homepage
- Hero section dengan background gradient biru
- Fitur pencarian cepat rumah sakit
- Bagian fitur utama dengan ikon dan deskripsi
- Bagian rumah sakit populer dengan kartu
- Footer dengan informasi kontak dan link penting

### Halaman Peta
- Peta fullscreen dengan panel filter di sisi kiri
- Toggle untuk menampilkan/menyembunyikan panel filter pada mobile
- Daftar hasil pencarian di bawah filter
- Detail rumah sakit muncul saat marker diklik

### Halaman Daftar Rumah Sakit
- Filter dan sorting di bagian atas
- Daftar rumah sakit dalam bentuk kartu atau list view (toggle)
- Pagination untuk navigasi halaman
- Quick view detail rumah sakit

### Halaman Detail Rumah Sakit
- Gambar header rumah sakit
- Informasi lengkap (nama, alamat, kontak, jam operasional)
- Daftar layanan yang tersedia
- Peta lokasi mini
- Rating dan ulasan

### Admin Dashboard
- Login page dengan form sederhana
- Sidebar untuk navigasi
- Tabel data dengan opsi CRUD
- Form input data dengan validasi
- Statistik dan overview

## Asset Design

### Logo
- Logo "Cek RS Terdekat" dengan font bold dan elemen grafis sederhana
- Versi light dan dark untuk berbagai background

### Ilustrasi
- Ilustrasi sederhana dan modern untuk halaman kosong atau onboarding
- Konsisten dalam gaya dan palette warna

### Foto
- Foto rumah sakit harus dalam rasio yang sama (16:9 atau 4:3)
- Kualitas tinggi dan menampilkan tampak depan rumah sakit
- Editing yang konsisten untuk brightness dan contrast

## Implementasi Teknis

### Framework & Libraries
- Next.js sebagai framework utama
- Tailwind CSS untuk styling
- ShadCN sebagai UI component library
- Leaflet.js untuk implementasi peta GIS

### Responsive Design
- Mobile-first approach
- Flexbox dan Grid untuk layout
- Media queries untuk adaptasi ke berbagai ukuran layar
- Testing pada berbagai perangkat

### Performance
- Lazy loading untuk gambar
- Code splitting untuk performa yang lebih baik
- Optimasi asset untuk mengurangi ukuran bundle

## Design Deliverables

1. Styleguide lengkap dengan komponen UI
2. Mockup high-fidelity untuk semua halaman utama
3. Prototype interaktif untuk user flow utama
4. Asset grafis dalam format yang siap diimplementasi
