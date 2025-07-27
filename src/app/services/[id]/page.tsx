"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import MainLayout from "../../../components/layout/MainLayout";
import dynamic from "next/dynamic";

const MapComponentWithNoSSR = dynamic(
  () => import("../../../components/map/MapComponent"),
  { ssr: false }
);

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  longDescription: string;
  hospitals: Hospital[];
}

interface Hospital {
  id: number;
  kode_rs: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance?: number;
  latitude: number;
  longitude: number;
  services: string[];
}

const sampleServices: Service[] = [
  /* sample data omitted for brevity */
];

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    const serviceId = Number(params.id);
    const foundService = sampleServices.find((s) => s.id === serviceId);
    setService(foundService || null);
    if (foundService) setFilteredHospitals(foundService.hospitals);
  }, [params.id]);

  useEffect(() => {
    if (service && searchQuery) {
      const filtered = service.hospitals.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHospitals(filtered);
    } else if (service) {
      setFilteredHospitals(service.hospitals);
    }
  }, [searchQuery, service]);

  if (!service) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/services" className="text-primary flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke Daftar Layanan
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 bg-primary-light p-4 rounded-lg mr-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={service.icon}
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                <p className="text-text-secondary mb-2">
                  Tersedia di {service.hospitals.length} rumah sakit di Surabaya
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Tentang Layanan</h2>
              <p className="text-text-secondary">{service.longDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Rumah Sakit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Nama atau alamat rumah sakit..."
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Daftar Rumah Sakit</h2>
              <ul className="space-y-4">
                {filteredHospitals.map((hospital) => (
                  <li
                    key={hospital.id}
                    className="border p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">{hospital.name}</h3>
                    <p className="text-sm text-gray-600">{hospital.address}</p>
                    <p className="text-sm text-gray-600">
                      Telepon: {hospital.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      Rating: {hospital.rating}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
