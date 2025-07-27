"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch("/api/hospitals");
        if (!res.ok) throw new Error("Gagal mengambil data rumah sakit");
        const data = await res.json();
        setHospitals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHospitals();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus rumah sakit ini?")) {
      try {
        const res = await fetch(`/api/hospitals/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Gagal menghapus rumah sakit");
        setHospitals(hospitals.filter((h) => h.kode_rs !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
            🏥 Dashboard Rumah Sakit
          </h1>
          <Link
            href="/admin/hospitals/add"
            className="bg-blue-600 text-white text-sm font-medium py-1.5 px-4 rounded hover:bg-blue-700 transition duration-200 text-center"
          >
            Tambah Rumah Sakit
          </Link>
        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((rs) => (
            <div
              key={rs.kode_rs}
              className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M9 21V9h6v12M9 13h6M12 10v6"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-blue-700">
                  {rs.nama}
                </h2>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Alamat:</span> {rs.lokasi.alamat}
              </p>
              <p className="text-gray-500 text-sm italic mb-4">
                Wilayah: {rs.lokasi.wilayah}
              </p>

              <p className="text-gray-700 text-sm mb-4">
                {rs.deskripsi.substring(0, 100)}...
              </p>

              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/admin/hospitals/edit/${rs.kode_rs}`}
                  className="bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded hover:bg-yellow-600 transition">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(rs.kode_rs)}
                  className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
