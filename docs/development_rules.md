# Development Rules: Web GIS Rumah Sakit Surabaya

## Standar Kode

### Umum
- Menggunakan bahasa Inggris untuk penamaan variabel, fungsi, dan komentar
- Mengikuti prinsip DRY (Don't Repeat Yourself)
- Mengikuti prinsip SOLID untuk pengembangan berorientasi objek
- Kode harus mudah dibaca dan dipahami oleh developer lain
- Menghindari penggunaan "magic numbers" dan "magic strings"

### JavaScript / TypeScript
- Menggunakan TypeScript untuk type safety
- Menggunakan ES6+ features (arrow functions, destructuring, spread operator, dll)
- Menggunakan async/await untuk operasi asynchronous
- Menghindari penggunaan `any` type di TypeScript kecuali benar-benar diperlukan
- Menggunakan interface untuk mendefinisikan tipe data kompleks

### React & Next.js
- Menggunakan functional components dan React Hooks
- Menggunakan Next.js App Router untuk routing
- Memisahkan komponen menjadi presentational dan container components
- Menggunakan React Context atau state management library untuk state global
- Menggunakan server components dan client components sesuai kebutuhan
- Mengimplementasikan lazy loading untuk optimasi performa

### CSS & Styling
- Menggunakan Tailwind CSS untuk styling
- Mengikuti pendekatan mobile-first untuk responsive design
- Menggunakan variabel CSS untuk nilai yang konsisten (warna, spacing, dll)
- Menghindari inline styles kecuali untuk nilai yang dinamis
- Menggunakan ShadCN UI components untuk konsistensi UI

## Struktur Proyek

```
web-rs-sby/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── admin/              # Admin pages
│   ├── hospitals/          # Hospital pages
│   ├── map/                # Map page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   ├── ui/                 # UI components (buttons, inputs, etc)
│   ├── layout/             # Layout components (header, footer, etc)
│   ├── map/                # Map related components
│   └── hospital/           # Hospital related components
├── lib/                    # Utility functions and shared logic
│   ├── api/                # API related utilities
│   ├── db/                 # Database related utilities
│   ├── hooks/              # Custom React hooks
│   └── utils/              # General utility functions
├── public/                 # Static assets
│   ├── images/             # Image assets
│   └── icons/              # Icon assets
├── prisma/                 # Prisma ORM files
│   └── schema.prisma       # Database schema
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Konvensi Penamaan

### Files & Folders
- Nama file komponen: PascalCase (contoh: `HospitalCard.tsx`)
- Nama file utilitas: camelCase (contoh: `formatDate.ts`)
- Nama file halaman: kebab-case (contoh: `hospital-detail.tsx`)
- Nama folder: kebab-case (contoh: `hospital-services/`)

### Kode
- Nama variabel: camelCase (contoh: `hospitalName`)
- Nama konstanta: UPPER_SNAKE_CASE (contoh: `MAX_RESULTS`)
- Nama fungsi: camelCase (contoh: `getHospitalById()`)
- Nama komponen: PascalCase (contoh: `HospitalCard`)
- Nama interface/type: PascalCase dengan awalan I untuk interface (contoh: `IHospital`, `HospitalType`)
- Nama class CSS: kebab-case (contoh: `hospital-card`)

### Database
- Nama tabel: snake_case, plural (contoh: `hospitals`)
- Nama kolom: snake_case (contoh: `operating_hours`)
- Foreign key: snake_case dengan format `table_name_id` (contoh: `hospital_id`)

## Praktik Git

### Branching Strategy
- Main branch: `main` (production-ready)
- Development branch: `dev` (integration branch)
- Feature branches: `feature/nama-fitur`
- Bug fix branches: `fix/deskripsi-bug`
- Release branches: `release/x.y.z`

### Commit Messages
- Menggunakan format: `<type>: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Contoh: `feat: add hospital filter by service`
- Deskripsi singkat dan jelas tentang perubahan yang dilakukan
- Gunakan bahasa Inggris untuk commit message

### Pull Requests
- Deskripsi yang jelas tentang perubahan yang dilakukan
- Referensikan issue terkait jika ada
- Minimal satu reviewer sebelum merge
- Semua CI checks harus pass sebelum merge

## Proses Quality Assurance

### Code Review
- Semua kode harus melalui proses code review sebelum di-merge
- Reviewer harus memperhatikan:
  - Kualitas kode dan kepatuhan terhadap standar
  - Potential bugs dan edge cases
  - Performance issues
  - Security vulnerabilities

### Testing
- Unit testing untuk fungsi dan komponen utama
- Integration testing untuk alur pengguna utama
- End-to-end testing untuk fitur kritis
- Minimal code coverage: 70%
- Semua test harus pass sebelum deployment

### Linting & Formatting
- ESLint untuk linting JavaScript/TypeScript
- Prettier untuk formatting kode
- Husky untuk pre-commit hooks
- Lint-staged untuk menjalankan linter pada files yang akan di-commit

## Praktik Keamanan

### Umum
- Tidak menyimpan credentials atau secrets di repository
- Menggunakan environment variables untuk konfigurasi sensitif
- Melakukan validasi input pada client dan server side
- Implementasi rate limiting untuk API endpoints

### Authentication & Authorization
- Menggunakan NextAuth.js untuk autentikasi
- Implementasi JWT dengan expiration time yang sesuai
- Menggunakan HTTPS untuk semua komunikasi
- Implementasi CSRF protection
- Proper role-based access control

### Database
- Menggunakan prepared statements untuk query database
- Tidak menyimpan password dalam plain text (gunakan hashing dengan salt)
- Implementasi database backup secara regular
- Validasi dan sanitasi semua input sebelum disimpan ke database

## Praktik Deployment

### Environment
- Development: Local environment
- Staging: Untuk testing sebelum production
- Production: Live environment

### Continuous Integration/Continuous Deployment
- Automated testing pada setiap push
- Automated build process
- Deployment otomatis ke staging setelah merge ke `dev`
- Manual approval untuk deployment ke production

### Monitoring & Logging
- Implementasi error tracking
- Performance monitoring
- User analytics
- Centralized logging system

## Dokumentasi

### Kode
- JSDoc comments untuk fungsi dan komponen penting
- README.md untuk setiap direktori utama
- Inline comments untuk kode yang kompleks

### API
- Dokumentasi endpoint API (route, parameters, response)
- Contoh request dan response
- Error codes dan handling

### User
- User manual untuk end-users
- Admin guide untuk administrator
- Dokumentasi instalasi dan setup

## Praktik Terbaik GIS

### Peta
- Menggunakan Leaflet.js untuk implementasi peta
- Mengoptimalkan loading tiles untuk performa
- Implementasi clustering untuk marker yang banyak
- Menyediakan kontrol zoom, pan, dan fullscreen

### Geolocation
- Meminta izin pengguna sebelum mengakses lokasi
- Menyediakan fallback jika geolocation tidak tersedia
- Mengimplementasikan caching lokasi untuk mengurangi API calls
- Menangani error geolocation dengan graceful degradation

### Data Spasial
- Menggunakan format GeoJSON untuk data spasial
- Mengoptimalkan query spasial di database
- Implementasi spatial indexing untuk performa query
- Validasi data koordinat sebelum disimpan
