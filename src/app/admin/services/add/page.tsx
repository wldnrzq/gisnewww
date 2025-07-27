// app/admin/services/add/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hospitalId: "",
    serviceName: "",
    description: "",
    icon: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      console.log("Sending data:", formData); // Debugging
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: formData.hospitalId,
          name: formData.serviceName,
          description: formData.description,
          icon: formData.icon,
        }),
      });

      const data = await res.json(); // Parse sebagai JSON
      console.log("Server response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Gagal menambahkan layanan");
      }

      setSuccess("Layanan berhasil ditambahkan!");
      // Tunggu sebentar sebelum redirect untuk memberikan feedback
      setTimeout(() => router.push("/admin/services"), 1000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menambahkan layanan");
      console.error("Error in submission:", err); // Debugging
    } finally {
      setLoading(false);
    }
  };

  // Data rumah sakit dari JSON yang kamu berikan
  const hospitals = [
    { id: "RS001", name: "RSUD Dr. Soetomo" },
    { id: "RS002", name: "Rumah Sakit Universitas Airlangga" },
    { id: "RS003", name: "Rumah Sakit Islam Surabaya" },
    { id: "RS004", name: "Rumah Sakit Angkatan Laut Dr. Ramelan (RSAL)" },
    { id: "RS005", name: "Rumah Sakit Wiyung Sejahtera" },
    { id: "RS006", name: "Rumah Sakit Muji Rahayu" },
    { id: "RS007", name: "RSUD Husada Prima" },
    { id: "RS008", name: "RS PKU Muhammadiyah Surabaya" },
    { id: "RS009", name: "Rumah Sakit Surabaya Medical Service" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Tambah Layanan
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Rumah Sakit
            </label>
            <select
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="">Pilih Rumah Sakit</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nama Layanan
            </label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Deskripsi
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Ikon
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Misalnya: fa-stethoscope"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:bg-blue-400">
            {loading ? "Memproses..." : "Tambah Layanan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
