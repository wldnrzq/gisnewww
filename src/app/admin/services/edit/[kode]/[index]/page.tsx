"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const { kode, index } = useParams() as { kode: string; index: string };
  const [formData, setFormData] = useState<Service>({
    id: "",
    name: "",
    description: "",
    icon: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services?hospitalId=${kode}`);
        const data = await res.json();
        let hospital;
        if (Array.isArray(data)) {
          hospital = data.find((h) => h.kode_rs === kode);
        } else if (data && data.kode_rs) {
          hospital = data;
        } else {
          throw new Error("Data rumah sakit tidak ditemukan");
        }
        if (hospital && hospital.layanan[parseInt(index, 10)]) {
          setFormData(hospital.layanan[parseInt(index, 10)]);
        } else {
          setError("Layanan tidak ditemukan");
        }
      } catch (err: any) {
        console.error("Gagal mengambil data layanan:", err);
        setError("Gagal memuat data layanan");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [kode, index]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: kode,
          serviceId: formData.id,
          name: formData.name,
          description: formData.description,
          icon: formData.icon,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate layanan");
      }

      router.push("/admin/services");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengupdate layanan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Edit Layanan
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Nama Layanan
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700">
              Ikon
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon || ""}
              onChange={handleChange}
              placeholder="Misalnya: fa-stethoscope"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:bg-blue-400">
            {loading ? "Memproses..." : "Update Layanan"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
