"use client";

import MainLayout from "../../components/layout/MainLayout";
import Link from "next/link";

// Define hospital interface
interface Hospital {
  id: number;
  kode_rs: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  services: string[];
  rating: number;
  image: string;
  highlight?: boolean; // ✅ tambahkan properti ini
}

// Sample data for hospitals
const sampleHospitals: Hospital[] = [
  {
    id: 1,
    kode_rs: "RS001",
    name: "RSUD Dr. Soetomo",
    address:
      "Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Kec. Gubeng, Kota Surabaya",
    phone: "(031) 5501078",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Spesialis (22 spesialisasi termasuk Anestesiologi, Bedah Plastik, Kardiologi, Onkologi, Geriatri, Pediatri, Ortopedi)",
      "Medical Check-Up",
      "Diagnostik Lanjutan (MRI, CT Scan, Fluoroscopy, Panoramic, Ultrasound, Radiologi Intervensi)",
      "Radioterapi",
      "Pelatihan Penanganan Kegawatdaruratan Maternal dan Neonatal",
      "Pencegahan dan Pengendalian Infeksi",
      "Konseling Kesehatan Reproduksi",
      "Layanan Transplantasi (ginjal, kornea)",
    ],
    rating: 4.5,
    image: "image/soeto.png",
  },
  {
    id: 2,
    kode_rs: "RS002",
    name: "Rumah Sakit Universitas Airlangga",
    address: "Jl. Mayjen Prof. Dr. Moestopo No. 47, Surabaya",
    phone: "+62 31 5501488",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Spesialis (21 spesialisasi termasuk Mata, Onkologi, Kardiologi, Ortopedi, Neurologi)",
      "Medical Check-Up",
      "Diagnostik Lanjutan (CT Scan, MRI, USG 4D, Laboratorium)",
      "Rehabilitasi Medik",
      "Layanan Bedah (termasuk bedah mata dan onkologi)",
      "Farmasi 24 Jam",
      "Klinik Jantungan",
    ],
    rating: 4.3,
    image: "image/una.jpg",
  },
  {
    id: 3,
    kode_rs: "RS003",
    name: "Rumah Sakit Islam Surabaya",
    address: "Jl. Achmad Yani No. 2-4, Wonokromo, Surabaya",
    phone: "+62 31 8291920",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan (Reguler BPJS dan Eksekutif Non-BPJS)",
      "Poliklinik Spesialis (Kardiologi, Neurologi, Urologi, Anak, Penyakit Dalam, Mata, Ortopedi)",
      "Hemodialisis (30 mesin, single-use dialiser)",
      "Diagnostik Lanjutan (CT Scan, USG, Rontgen, Laboratorium)",
      "Layanan Bedah (4 kamar operasi, termasuk ortopedi dengan C-arm dan mata dengan phakoemulsifikasi)",
      "Klinik Fertilitas",
      "Rehabilitasi Medik (Terapi Okupasi, Terapi Wicara, Tumbuh Kembang Anak)",
      "Poli Laktasi (konsultasi ASI)",
      "Pemulasaran Jenazah",
      "Farmasi 24 Jam",
    ],
    rating: 4.7,
    image: "image/rsi.png",
  },
  {
    id: 4,
    kode_rs: "RS004",
    name: "Rumah Sakit Angkatan Laut Dr. Ramelan (RSAL)",
    address: "Jl. Gadung No. 1, Surabaya",
    phone: "+62 31 8439570",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Spesialis (Penyakit Dalam, Anak, Bedah, THT, Mata, Ortopedi)",
      "Diagnostik (Rontgen, USG, Laboratorium)",
      "Layanan Bedah Umum",
      "Rehabilitasi Medik",
      "Layanan Kedokteran Hiperbarik",
    ],
    rating: 4.2,
    image: "/image/rsal.png",
  },
  {
    id: 5,
    kode_rs: "RS005",
    name: "Rumah Sakit Wiyung Sejahtera",
    address: "Jl. Raya Menganti Wiyung No. 27, Surabaya",
    phone: "+62 31 7532777",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Spesialis (Anak, Penyakit Dalam, Bedah, THT, Mata)",
      "Diagnostik (Rontgen, USG, Laboratorium)",
      "Layanan Bedah Umum",
    ],
    rating: 4.0,
    image: "/image/rsadi.png",
  },
  {
    id: 6,
    kode_rs: "RS006",
    name: "Rumah Sakit Muji Rahayu",
    address: "Jl. Raya Manukan Kulon No. 66, Surabaya",
    phone: "+62 31 7417171",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Spesialis (Penyakit Dalam, Anak, Bedah, THT, Mata)",
      "Diagnostik (USG, Rontgen, Laboratorium)",
      "Layanan Bedah Umum",
    ],
    rating: 4.6,
    image: "/image/muji.png",
  },
  {
    id: 7,
    kode_rs: "RS007",
    name: "RSUD Husada Prima",
    address: "Jl. Karang Tembok No. 39, Surabaya",
    phone: "031-3713839",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "IGD",
      "Poliklinik Spesialis (Bedah, Anak, Penyakit Dalam, dll.)",
      "Laboratorium",
      "Radiologi",
      "Bedah Laparoskopi",
      "Radiologi",
    ],
    rating: 4.6,
    image: "/image/husada.jpg",
  },
  {
    id: 8,
    kode_rs: "RS008",
    name: "RS PKU Muhammadiyah Surabaya",
    address:
      "Jl. Raya Sutorejo No. 64, Dukuh Sutorejo, Kec. Mulyorejo, Surabaya",
    phone: "031-5939933",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "IGD 24 Jam",
      "Poliklinik Spesialis (Penyakit Dalam, Anak, Bedah, THT, Mata, dll.)",
      "Laboratorium",
      "Radiologi",
      "Hemodialisis",
      "MCU",
      "Fisioterapi",
    ],
    rating: 4.6,
    image: "/image/pku.png",
  },
  {
    id: 9,
    kode_rs: "RS009",
    name: "Rumah Sakit Surabaya Medical Service",
    address: "Jl. Kapuas No.2, Keputran, Kec. Tegalsari, Surabaya",
    phone: "031-5686161",
    operatingHours: "24 Jam",
    services: [
      "Rawat Inap",
      "Rawat Jalan",
      "UGD 24 Jam",
      "Poliklinik Spesialis",
      "Laboratorium",
      "Radiologi",
    ],
    rating: 4.6,
    image: "/image/mdical.jpg",
  },
];

export default function HospitalsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          Daftar Rumah Sakit Surabaya
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="card hover:shadow-lg transition-shadow rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="relative h-40 sm:h-48 mb-4 rounded-t-lg overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="px-4 pb-4">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {hospital.name}
                </h3>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < Math.floor(hospital.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {hospital.rating}/5
                    </span>
                  </div>
                </div>

                <p className="flex items-start mb-2 text-gray-600 text-sm sm:text-base">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0"
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
                  {hospital.address}
                </p>

                <p className="flex items-start mb-2 text-gray-600 text-sm sm:text-base">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {hospital.phone}
                </p>

                <p className="flex items-start mb-3 text-gray-600 text-sm sm:text-base">
                  {/* Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {hospital.operatingHours}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Layanan:</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.services.slice(0, 3).map((service, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{hospital.services.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/hospitals/${hospital.kode_rs}`}
                  className="btn-secondary text-center text-sm py-2 w-full block rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
