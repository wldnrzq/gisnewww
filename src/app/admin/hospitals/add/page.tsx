"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AddHospitalPage() {
  const router = useRouter();
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

  // Validasi rentang koordinat untuk Surabaya
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    const LATITUDE_RANGE = { min: -7.4, max: -7.1 };
    const LONGITUDE_RANGE = { min: 112.6, max: 112.8 };
    return (
      lat >= LATITUDE_RANGE.min &&
      lat <= LATITUDE_RANGE.max &&
      lng >= LONGITUDE_RANGE.min &&
      lng <= LONGITUDE_RANGE.max
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi input
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

    if (!isValidCoordinate(latitude, longitude)) {
      setError(
        "Koordinat tidak valid untuk wilayah Surabaya (latitude: -7.4 hingga -7.1, longitude: 112.6 hingga 112.8)"
      );
      return;
    }

    try {
      const res = await fetch("/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          region: formData.region,
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
        setError(errorData.error || "Gagal menambahkan rumah sakit");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Tambah Rumah Sakit
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
              Simpan Rumah Sakit
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
