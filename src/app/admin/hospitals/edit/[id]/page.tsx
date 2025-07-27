// app/admin/hospitals/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function EditHospitalPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    region: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    website: "",
    operatingHours: "",
    services: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHospital() {
      try {
        const res = await fetch(`/api/hospitals/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data rumah sakit");
        const data = await res.json();
        setFormData({
          name: data.nama || "",
          description: data.deskripsi || "",
          address: data.lokasi.alamat || "",
          region: data.lokasi.wilayah || "",
          phone: data.kontak.telepon || "",
          email: data.kontak.email || "",
          latitude: data.koordinat.lat.toString() || "",
          longitude: data.koordinat.lng.toString() || "",
          website: data.website || "",
          operatingHours: data.operatingHours || "",
          services: data.layanan.join(", ") || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHospital();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError(
        "Harap isi semua kolom wajib (Nama, Alamat, Telepon, Latitude, Longitude)"
      );
      return;
    }

    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Latitude dan Longitude harus berupa angka valid");
      return;
    }

    try {
      const res = await fetch(`/api/hospitals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          address: formData.address,
          region: formData.region || null,
          phone: formData.phone,
          email: formData.email || null,
          website: formData.website || null,
          latitude: latitude,
          longitude: longitude,
          operatingHours: formData.operatingHours || null,
          services: formData.services
            ? formData.services.split(",").map((s) => s.trim())
            : [],
        }),
      });

      if (res.ok) {
        router.push("/admin/hospitals");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Gagal mengupdate rumah sakit");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengupdate data");
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Edit Rumah Sakit
        </h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nama RS *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: RSUD Surabaya"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Alamat *
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jalan, nomor, RT/RW"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Wilayah
            </label>
            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Contoh: Surabaya Timur"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Telepon *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxx"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Latitude *
              </label>
              <input
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="-7.2458"
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Longitude *
              </label>
              <input
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="112.7383"
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Website
            </label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Jam Operasional
            </label>
            <input
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              placeholder="Contoh: 24 Jam"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Layanan (pisahkan dengan koma)
            </label>
            <input
              name="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="IGD, Rawat Inap, Radiologi"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
              Update Rumah Sakit
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
