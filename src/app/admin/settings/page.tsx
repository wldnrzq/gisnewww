"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettingsPage() {
  const [adminData, setAdminData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Pastikan cookie dikirim
      });
      const data = await res.json();
      console.log("Fetch Response:", data, "Status:", res.status); // Debugging
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data");
      setAdminData(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
      });
    } catch (err: any) {
      setError(err.message || "Pengguna tidak login");
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Pastikan cookie dikirim
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Update Response:", data, "Status:", res.status); // Debugging
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui data");
      setAdminData(data);
      setIsEditing(false);
      setSuccessMessage("Profil berhasil diperbarui!");
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating admin data:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: adminData?.name || "",
      email: adminData?.email || "",
      password: "",
    });
    setError(null);
    setSuccessMessage(null);
  };

  if (error) return <div className="p-4 text-red-700">{error}</div>;
  if (!adminData) return <div className="p-4">Memuat...</div>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-2">
          Pengaturan Admin
        </h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru (Opsional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  Simpan Perubahan
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
