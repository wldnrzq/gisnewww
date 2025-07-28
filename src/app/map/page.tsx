"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [initialLoading, setInitialLoading] = useState(true); // Ganti loading menjadi initialLoading
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

  // Fungsi untuk mengambil data dari API /api/hospitals
  const fetchHospitalsFromDb = useCallback(async () => {
    try {
      const res = await fetch("/api/hospitals", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(
          `Gagal mengambil data rumah sakit dari database: ${res.status} ${res.statusText}`
        );
      }
      const dbHospitals = await res.json();
      console.log("Data dari /api/hospitals:", dbHospitals);
      return dbHospitals.filter(
        (h: HospitalRaw) =>
          h.koordinat &&
          typeof h.koordinat.lat === "number" &&
          typeof h.koordinat.lng === "number" &&
          !isNaN(h.koordinat.lat) &&
          !isNaN(h.koordinat.lng) &&
          isValidCoordinate(h.koordinat.lat, h.koordinat.lng)
      );
    } catch (err: any) {
      console.error("Error fetching hospitals:", {
        message: err.message,
        stack: err.stack,
      });
      setError("Gagal memuat data dari database. Menampilkan data statis.");
      return [];
    }
  }, []);

  // Fungsi untuk menggabungkan data JSON dan database
  const combineHospitals = useCallback(
    (
      jsonHospitals: HospitalRaw[],
      dbHospitals: HospitalRaw[]
    ): HospitalRaw[] => {
      const hospitalMap = new Map<string, HospitalRaw>();

      // Tambahkan data dari JSON
      jsonHospitals.forEach((hospital) => {
        if (isValidCoordinate(hospital.koordinat.lat, hospital.koordinat.lng)) {
          hospitalMap.set(hospital.kode_rs, hospital);
        } else {
          console.warn(
            `Invalid coordinates in JSON for hospital ${hospital.nama}:`,
            hospital.koordinat
          );
        }
      });

      // Tambahkan data dari database, timpa jika kode_rs sama
      dbHospitals.forEach((hospital) => {
        hospitalMap.set(hospital.kode_rs, hospital);
      });

      const combined = Array.from(hospitalMap.values());
      console.log("Combined hospitals:", combined);
      return combined;
    },
    []
  );

  // Muat data awal saat komponen dimuat
  useEffect(() => {
    async function loadInitialHospitals() {
      setInitialLoading(true);
      const dbHospitals = await fetchHospitalsFromDb();
      const combinedHospitals = combineHospitals(
        hospitalsData.rumah_sakit,
        dbHospitals
      );
      setHospitals(combinedHospitals);
      setFilteredHospitals(combinedHospitals);
      setInitialLoading(false);
    }
    loadInitialHospitals();
  }, [fetchHospitalsFromDb, combineHospitals]);

  // Polling data terbaru setiap 30 detik tanpa mengubah UI
  useEffect(() => {
    const interval = setInterval(async () => {
      const dbHospitals = await fetchHospitalsFromDb();
      if (dbHospitals.length > 0) {
        // Hanya update jika data baru tersedia
        const combinedHospitals = combineHospitals(
          hospitalsData.rumah_sakit,
          dbHospitals
        );
        setHospitals(combinedHospitals);
        // Update filteredHospitals nanti di useEffect filter
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchHospitalsFromDb, combineHospitals]);

  // Update userLocation saat geolocation tersedia
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });
          console.log("User location:", { lat: userLat, lng: userLng });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Gagal mendapatkan lokasi pengguna");
        }
      );
    }
  }, []);

  // Filter, sort, dan highlight rumah sakit
  useEffect(() => {
    if (!hospitals.length) return;

    const updatedHospitals: HospitalRaw[] = hospitals.map((hospital) => {
      let distance: number | undefined;
      if (
        userLocation &&
        hospital.koordinat &&
        typeof hospital.koordinat.lat === "number" &&
        typeof hospital.koordinat.lng === "number" &&
        !isNaN(hospital.koordinat.lat) &&
        !isNaN(hospital.koordinat.lng)
      ) {
        distance = getDistanceInKm(
          userLocation.lat,
          userLocation.lng,
          hospital.koordinat.lat,
          hospital.koordinat.lng
        );
      }
      return {
        ...hospital,
        jarak: distance ? parseFloat(distance.toFixed(2)) : undefined,
        highlight: false,
      };
    });

    const filtered = updatedHospitals
      .filter((hospital) => {
        const matchesSearch = hospital.nama
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesService =
          selectedServices.length === 0 ||
          selectedServices.every((service) =>
            hospital.layanan.some((l) =>
              l.toLowerCase().includes(service.toLowerCase())
            )
          );
        const matchesDistance = isWithinDistance(hospital.jarak);
        return matchesSearch && matchesService && matchesDistance;
      })
      .sort((a, b) => (a.jarak ?? Infinity) - (b.jarak ?? Infinity));

    if (selectedServices.length > 0) {
      filtered.forEach((rs) => {
        rs.highlight = selectedServices.every((layanan) =>
          rs.layanan.some((l) =>
            l.toLowerCase().includes(layanan.toLowerCase())
          )
        );
      });
    }

    console.log("Filtered hospitals:", filtered);
    setFilteredHospitals(filtered);
    const filteredIds = filtered.map((rs) => rs.kode_rs);
    setOpenPopupIds(filteredIds);
  }, [hospitals, searchTerm, selectedServices, maxDistance, userLocation]);

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

  function isWithinDistance(hospitalDistance: number | undefined) {
    if (hospitalDistance === undefined) return maxDistance === "Semua";
    if (maxDistance === "Semua") return true;
    const max = parseFloat(maxDistance.replace(" km", ""));
    return hospitalDistance <= max;
  }

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const convertHospitalsForMap = useCallback(
    (original: HospitalRaw[]): Hospital[] => {
      const converted = original.map((h) => {
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
          address: h.lokasi?.alamat || "Alamat tidak tersedia",
          latitude: Number(h.koordinat?.lat) || 0,
          longitude: Number(h.koordinat?.lng) || 0,
          services: h.layanan || [],
          rating: 4.5,
          doctors: doctorsMap[h.nama] || [],
          jarak: h.jarak ?? 0,
          highlight: h.highlight || false,
        };
      });
      console.log("Converted hospitals for map:", converted);
      return converted;
    },
    []
  );

  const highlightLayanan = selectedServices.length > 0 ? selectedServices : [];

  const rumahSakitDenganLayananSama =
    highlightLayanan.length > 0
      ? filteredHospitals
          .filter((rs) =>
            rs.layanan.some((layanan) => highlightLayanan.includes(layanan))
          )
          .slice(0, 3)
      : [];

  if (initialLoading)
    return <div className="p-6 text-center">Memuat data...</div>;
  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        {error}
        <button
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );

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
                          Jarak: {rs.jarak ?? "N/A"} km
                        </p>
                        <p className="text-sm text-gray-600">
                          Koordinat: {rs.koordinat?.lat}, {rs.koordinat?.lng}
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
