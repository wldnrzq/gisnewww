"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MainLayout from "../../components/layout/MainLayout";
import hospitalsData from "../../data/hospitals.json";
import { getDistance } from "geolib";

const MapComponentWithNoSSR = dynamic(
  () => import("../../components/map/MapComponent"),
  { ssr: false }
);

type HospitalRaw = {
  kode_rs: string;
  nama: string;
  deskripsi?: string;
  lokasi: { alamat: string; wilayah: string };
  kontak: { telepon?: string; whatsapp?: string; email?: string };
  layanan: string[];
  koordinat: { lat: number; lng: number };
  jarak?: number;
  highlight?: boolean;
};

type Hospital = {
  id: string;
  kode_rs: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  jarak?: number;
  services: string[];
  rating: number;
  doctors: string[];
  highlight?: boolean;
};

export default function MapPage() {
  const [hospitals, setHospitals] = useState<HospitalRaw[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<HospitalRaw[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState("Semua");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [openPopupIds, setOpenPopupIds] = useState<string[]>([]);

  function getDistanceInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const distanceInMeters = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distanceInMeters / 1000;
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        const updatedHospitals: HospitalRaw[] = hospitalsData.rumah_sakit.map(
          (hospital) => {
            const rsLat = hospital.koordinat.lat;
            const rsLng = hospital.koordinat.lng;
            const distance = getDistanceInKm(userLat, userLng, rsLat, rsLng);
            return {
              ...hospital,
              jarak: parseFloat(distance.toFixed(2)),
              highlight: false,
            };
          }
        );

        updatedHospitals.sort(
          (a, b) => (a.jarak ?? Infinity) - (b.jarak ?? Infinity)
        );

        const rumahSakitDenganLayanan =
          selectedServices.length > 0
            ? updatedHospitals.filter((rs) =>
                selectedServices.every((layanan) =>
                  rs.layanan.some((l) =>
                    l.toLowerCase().includes(layanan.toLowerCase())
                  )
                )
              )
            : [];

        updatedHospitals.forEach((rs) => (rs.highlight = false));

        if (selectedServices.length > 0 && rumahSakitDenganLayanan.length > 0) {
          rumahSakitDenganLayanan.forEach((rs) => {
            rs.highlight = true;
          });
        } else {
          // Clear semua highlight
          updatedHospitals.forEach((rs) => (rs.highlight = false));
        }

        setHospitals(updatedHospitals);
      });
    }
  }, [selectedServices]);

  function isWithinDistance(hospitalDistance: number | undefined) {
    if (hospitalDistance === undefined) return false;
    if (maxDistance === "Semua") return true;
    const max = parseFloat(maxDistance.replace(" km", ""));
    return hospitalDistance <= max;
  }

  useEffect(() => {
    const filtered = hospitals
      .filter((hospital) => {
        const matchesSearch = hospital.nama
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesService =
          selectedServices.length === 0 ||
          selectedServices.every((service) =>
            hospital.layanan.includes(service)
          );
        const matchesDistance = isWithinDistance(hospital.jarak);
        return matchesSearch && matchesService && matchesDistance;
      })
      .sort((a, b) => (a.jarak ?? Infinity) - (b.jarak ?? Infinity));

    setFilteredHospitals(filtered);
    const filteredIds = filtered.map((rs) => rs.kode_rs);
    setOpenPopupIds(filteredIds);
  }, [hospitals, searchTerm, selectedServices, maxDistance]);

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const convertHospitalsForMap = (original: HospitalRaw[]): Hospital[] => {
    return original.map((h) => {
      const doctorsMap: { [key: string]: string[] } = {
        "RSUD Dr. Soetomo": [
          "AGUS ALI FAUZI, dr., PGD., Pall Med.",
          "AHMAD AMIN MAHMUDIN, dr.",
          "BUDI SULISTIANI YULIANTO, dr.",
        ],
        "Rumah Sakit Universitas Airlangga": [
          "Adi Wasis Prakosa, dr",
          "Aditea Etnawati Putri, dr",
          "Lenny Octavia, dr",
        ],
        "Rumah Sakit Islam Surabaya": [
          "dr. Putri Ariska Anggraini",
          "dr. H. Mabruri",
        ],
        "Rumah Sakit Angkatan Laut Dr. Ramelan (RSAL)": [
          "dr. Hendy Bhaskara",
          "dr. Akhmad Rofiq",
          "dr. Muhammad Rizky Ramadhani",
        ],
        "Rumah Sakit Wiyung Sejahtera": [
          "dr. Anis Amiranti, Sp.A",
          "dr. Robby Nurhariansyah, Sp.A",
        ],
        "Rumah Sakit Muji Rahayu": ["dr. Bilqis Fiqotun Nabila"],
        "RSUD Husada Prima": [
          "dr. Ergia Latifolia, Sp A",
          "dr. Chairun Nur Prasetya Sp.B",
          "dr. Achmadi, Sp.OG",
        ],
        "RS PKU Muhammadiyah Surabaya": [
          "dr. Bagus Aulia Mahdi , Sp. PD.",
          "dr. Agus Maulana, Sp.B.",
        ],
        "Rumah Sakit Surabaya Medical Service": [
          "Atina Irani Wira Putri, Sp.PD",
          "dr. Wisda Medika V., Sp.JP",
          "dr. Ira Yunita, Sp. D.V.E",
        ],
      };
      return {
        id: h.kode_rs,
        kode_rs: h.kode_rs,
        name: h.nama,
        address: h.lokasi.alamat,
        latitude: h.koordinat.lat,
        longitude: h.koordinat.lng,
        services: h.layanan,
        rating: 4.5,
        doctors: doctorsMap[h.nama] || [],
        jarak: h.jarak ?? 0,
        highlight: h.highlight || false,
      };
    });
  };

  const highlightLayanan = selectedServices.length > 0 ? selectedServices : [];

  const rumahSakitDenganLayananSama =
    highlightLayanan.length > 0
      ? hospitals
          .filter((rs) =>
            rs.layanan.some((layanan) => highlightLayanan.includes(layanan))
          )
          .slice(0, 3)
      : [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Peta Rumah Sakit Surabaya</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Filter Rumah Sakit</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layanan
                </label>
                <div
                  className="max-h-40 overflow-y-auto space-y-2 pr-2"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {[
                    "UGD 24 Jam",
                    "IGD 24 Jam",
                    "Poli Umum",
                    "Poli Anak",
                    "Poli Jiwa",
                    "Andrologi",
                    "Toraks dan Kardiak",
                    "Anestesiologi dan Reanimasi",
                    "Poli Gigi",
                    "Poli Mata",
                    "Poli THT-KL",
                    "Poli Jantung",
                    "Poli Paru",
                    "Poli Penyakit Dalam",
                    "Poli Bedah Umum",
                    "Poli Kandungan",
                    "Poli Saraf",
                    "Laboratorium",
                    "Radiologi",
                    "ICU",
                    "Rawat Inap",
                    "Medical Check-Up",
                    "Fisioterapi",
                    "Farmasi",
                    "Ruang Isolasi",
                    "Layanan BPJS",
                  ].map((service, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`service-${index}`}
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceChange(service)}
                      />
                      <label
                        htmlFor={`service-${index}`}
                        className="ml-2 text-sm text-gray-700">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jarak Maksimum
                </label>
                <select
                  className="input-field py-2 w-full border px-2"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}>
                  <option>1 km</option>
                  <option>5 km</option>
                  <option>10 km</option>
                  <option>15 km</option>
                  <option>Semua</option>
                </select>
              </div>
            </div>

            {highlightLayanan.length > 0 &&
              rumahSakitDenganLayananSama.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
                  <h2 className="text-lg font-semibold mb-3">
                    RS dengan Layanan: {highlightLayanan.join(", ")}
                  </h2>
                  <div className="space-y-3">
                    {rumahSakitDenganLayananSama.map((rs, i) => (
                      <div key={i} className="border-b border-gray-200 pb-2">
                        <h3 className="font-medium">{rs.nama}</h3>
                        <p className="text-sm text-gray-600">
                          Jarak: {rs.jarak} km
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rs.layanan.map((layanan, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {layanan}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <MapComponentWithNoSSR
                hospitals={convertHospitalsForMap(filteredHospitals)}
                showUserLocation={!!userLocation}
                userLocation={userLocation}
                height="500px"
                openPopupIds={openPopupIds}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
