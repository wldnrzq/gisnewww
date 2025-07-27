// app/admin/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Hospital {
  kode_rs: string;
  nama: string;
  layanan: Service[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      console.log("Fetched data:", data); // Debugging
      // Sesuaikan dengan struktur respons API
      const hospitals = Array.isArray(data) ? data : [];
      setServices(hospitals);
    } catch (err: any) {
      console.error("Gagal mengambil data layanan:", err);
      setError("Gagal memuat data layanan. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (hospitalKode: string, serviceIndex: number) => {
    if (!confirm("Apakah yakin ingin menghapus layanan ini?")) return;
    try {
      const hospital = services.find((h) => h.kode_rs === hospitalKode);
      if (hospital && hospital.layanan[serviceIndex]) {
        await fetch("/api/services", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospitalId: hospitalKode,
            serviceId: hospital.layanan[serviceIndex].id,
          }),
        });
        fetchServices(); // Refresh data
      }
    } catch (err) {
      console.error("Gagal menghapus layanan:", err);
      setError("Gagal menghapus layanan. Coba lagi nanti.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            Daftar Layanan (
            {services.reduce(
              (acc, curr) => acc + (curr.layanan?.length || 0),
              0
            ) || 0}
            )
          </h1>
          <Link
            href="/admin/services/add"
            className="bg-blue-600 text-white text-sm font-medium py-1.5 px-4 rounded-md hover:bg-blue-700 transition duration-200 text-center"
          >
            Tambah Layanan
          </Link>

        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Memuat data layanan...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : (
          <div className="space-y-6">
            {services.map((hospital) => (
              <div
                key={hospital.kode_rs}
                className="bg-white border border-blue-100 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-100 pb-2">
                  {hospital.nama}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {hospital.layanan?.map((service, index) => (
                    <div
                      key={`${hospital.kode_rs}-${index}`}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-between hover:bg-gray-100 transition">
                      <span className="text-sm text-gray-700 font-medium truncate">
                        {service.name}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/services/edit/${hospital.kode_rs}/${index}`}
                          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(hospital.kode_rs, index)}
                          className="text-red-600 text-sm font-medium hover:text-red-800 transition">
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!hospital.layanan || hospital.layanan.length === 0) && (
                  <p className="text-center text-gray-600 py-4">
                    Tidak ada layanan.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}