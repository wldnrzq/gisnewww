"use client";

import MainLayout from "../../components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Tentang Web GIS Rumah Sakit Surabaya
        </h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Aplikasi Pencarian Rumah Sakit Berbasis GIS
              </h2>
              <p className="text-text-secondary mb-4">
                Web GIS Rumah Sakit Surabaya adalah aplikasi berbasis web yang
                dirancang untuk membantu masyarakat Surabaya dan sekitarnya
                dalam mencari rumah sakit terdekat dengan layanan yang
                dibutuhkan.
              </p>
              <p className="text-text-secondary mb-4">
                Dengan memanfaatkan teknologi Geographic Information System
                (GIS), aplikasi ini menyediakan informasi lokasi rumah sakit di
                peta interaktif, memungkinkan pengguna untuk menemukan rumah
                sakit berdasarkan lokasi mereka saat ini.
              </p>
              <p className="text-text-secondary">
                Aplikasi ini dikembangkan dengan tujuan untuk meningkatkan
                aksesibilitas layanan kesehatan dan membantu masyarakat
                mendapatkan penanganan medis dengan lebih cepat dan tepat.
              </p>
            </div>
            <div className="md:w-1/2 bg-primary-light flex items-center justify-center p-8">
              <div className="rounded-xl overflow-hidden">
                <Image
                  src="/image/bg.png"
                  alt="Web GIS Rumah Sakit Surabaya"
                  width={800}
                  height={800}
                  className="w-full h-auto border-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="bg-primary-light p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">
                Pencarian Berbasis Lokasi
              </h3>
            </div>
            <p className="text-text-secondary">
              Temukan rumah sakit terdekat berdasarkan lokasi Anda saat ini.
              Aplikasi akan menampilkan daftar rumah sakit beserta jarak dan
              estimasi waktu tempuh.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="bg-primary-light p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Filter Layanan</h3>
            </div>
            <p className="text-text-secondary">
              Filter rumah sakit berdasarkan layanan yang Anda butuhkan, seperti
              UGD 24 jam, poli spesialis, laboratorium, dan layanan lainnya.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="bg-primary-light p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Informasi Lengkap</h3>
            </div>
            <p className="text-text-secondary">
              Dapatkan informasi lengkap tentang rumah sakit, termasuk alamat,
              nomor telepon, jam operasional, layanan yang tersedia, dan ulasan
              dari pengguna lain.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Cara Menggunakan Aplikasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    Izinkan Akses Lokasi
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Berikan izin aplikasi untuk mengakses lokasi Anda agar dapat
                    menampilkan rumah sakit terdekat dengan akurat.
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Cari Rumah Sakit</h3>
                  <p className="text-text-secondary text-sm">
                    Gunakan fitur pencarian atau filter untuk menemukan rumah
                    sakit yang sesuai dengan kebutuhan Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Lihat Detail</h3>
                  <p className="text-text-secondary text-sm">
                    Klik pada rumah sakit untuk melihat informasi lengkap,
                    termasuk layanan yang tersedia dan ulasan.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    Filter Berdasarkan Layanan
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Gunakan filter layanan untuk menemukan rumah sakit yang
                    menyediakan layanan spesifik yang Anda butuhkan.
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-4">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Lihat Rute</h3>
                  <p className="text-text-secondary text-sm">
                    Dapatkan petunjuk arah ke rumah sakit pilihan Anda dengan
                    mudah melalui peta interaktif.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  6
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">
                    Bagikan Informasi
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Bagikan informasi rumah sakit dengan keluarga atau teman
                    yang membutuhkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary text-white rounded-xl shadow-sm p-6 mb-8">
          <div className="md:flex items-center">
            <div className="md:w-2/3 mb-4 md:mb-0">
              <h2 className="text-2xl font-semibold mb-2">Butuh Bantuan?</h2>
              <p className="text-white/80">
                Jika Anda memiliki pertanyaan atau masukan tentang aplikasi ini,
                jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
              </p>
            </div>
            <div className="md:w-1/3 md:text-right">
              <Link
                href="/contact"
                className="inline-block bg-white text-primary font-medium px-6 py-3 rounded-lg hover:bg-primary-light hover:text-primary-dark transition-colors">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Tim Pengembang</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/image/dn.jpg"
                  alt="Developer"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">Muchammad Ramadani </h3>
              <p className="text-text-secondary text-sm">Front-end Developer</p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/image/wl.jpg"
                  alt="Designer"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">Wildan Habibi R</h3>
              <p className="text-text-secondary text-sm">Back-end Developer</p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src="/image/dea.jpg"
                  alt="Data Analyst"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">Dea Ayu Novita Putri </h3>
              <p className="text-text-secondary text-sm">GIS Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
