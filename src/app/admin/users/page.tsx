"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { User } from "@prisma/client";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Gagal mengambil data pengguna");
      setUsers(data.users || []);
    } catch (err: any) {
      console.error("Gagal mengambil data pengguna:", err);
      setError(err.message || "Gagal memuat data pengguna. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        `Apakah yakin ingin menghapus ${
          activeTab === "admin" ? "admin" : "pengguna"
        } ini?`
      )
    )
      return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus pengguna");
      }
    } catch (err: any) {
      console.error("Gagal menghapus pengguna:", err);
      setError(err.message || "Gagal menghapus pengguna. Coba lagi nanti.");
    }
  };

  const adminUsers = users.filter((user) => user.role === "ADMIN");
  const regularUsers = users.filter((user) => user.role === "USER");

  const currentUsers = activeTab === "admin" ? adminUsers : regularUsers;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Daftar Pengguna</h1>
          <Link
            href="/admin/users/add"
            className="bg-blue-600 text-center font-medium text-white  py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Tambah Pengguna
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : (
          <>
            {/* Tab Opsi */}
            <div className="mb-6">
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-2 px-4 rounded-l ${
                  activeTab === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Admin ({adminUsers.length})
              </button>
              <button
                onClick={() => setActiveTab("user")}
                className={`py-2 px-4 rounded-r ${
                  activeTab === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                Pengguna ({regularUsers.length})
              </button>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-blue-100 text-blue-700">
                  <tr>
                    <th className="py-3 px-4 text-left">Nama</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Tanggal Daftar</th>
                    <th className="py-3 px-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <Link
                          href={`/admin/users/edit/${user.id}`}
                          className="text-sm text-blue-600 hover:underline">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-sm text-red-600 hover:underline">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentUsers.length === 0 && (
                <p className="text-center text-gray-600 py-4">
                  Belum ada {activeTab === "admin" ? "admin" : "pengguna"}.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
