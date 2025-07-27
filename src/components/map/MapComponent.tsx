"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { hospitalIcon, userLocationIcon } from "./CustomMarker";
import { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

interface Hospital {
  id: string;
  kode_rs: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string[];
  rating: number;
  doctors: string[];
  jarak?: number;
  highlight?: boolean;
}

interface MapComponentProps {
  hospitals?: Hospital[];
  height?: string;
  width?: string;
  showUserLocation?: boolean;
  openPopupIds?: string[];
  userLocation?: { lat: number; lng: number } | null;
}

export default function MapComponent({
  hospitals = [],
  height = "600px",
  width = "100%",
  showUserLocation = true,
  openPopupIds = [],
  userLocation,
}: MapComponentProps) {
  const mapRef = useRef<LeafletMap>(null);
  const markerRefs = useRef<{ [key: string]: LeafletMarker | null }>({});
  const center: [number, number] = [-7.2575, 112.7521];

  useEffect(() => {
    Object.values(markerRefs.current).forEach((marker) => {
      marker?.closePopup();
    });

    if (openPopupIds.length > 0) {
      const first = openPopupIds[0];
      if (markerRefs.current[first]) {
        markerRefs.current[first]?.openPopup();
      }
    }
  }, [openPopupIds]);

  // Validasi data hospitals
  const validHospitals = hospitals.filter(
    (hospital) =>
      hospital.id &&
      typeof hospital.latitude === "number" &&
      typeof hospital.longitude === "number" &&
      !isNaN(hospital.latitude) &&
      !isNaN(hospital.longitude)
  );

  // Debugging
  console.log("Valid hospitals in MapComponent:", validHospitals);

  return (
    <div
      style={{
        height: `calc(${height} + 40px)`,
        width,
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : center}
        zoom={13}
        ref={mapRef}
        style={{ height, width: "100%" }}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showUserLocation && userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}>
            <Popup>
              <p className="font-medium text-center">
                Lokasi Anda
                <br />
                Lat: {userLocation.lat.toFixed(4)}
                <br />
                Lng: {userLocation.lng.toFixed(4)}
              </p>
            </Popup>
          </Marker>
        )}

        {validHospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.latitude, hospital.longitude]}
            icon={hospitalIcon}
            ref={(ref) => {
              markerRefs.current[hospital.id] = ref;
            }}>
            <Popup>
              <div className="p-3 w-64 max-h-72 overflow-y-auto space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-1">
                    {hospital.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{hospital.address}</p>
                  {hospital.jarak !== undefined && (
                    <p className="text-blue-600 font-semibold text-xs mt-1">
                      📍 Jarak: {hospital.jarak.toFixed(2)} km
                    </p>
                  )}
                </div>

                <div className="flex items-center text-yellow-500 text-sm">
                  <span className="mr-1">★</span>
                  <span>{hospital.rating}/5</span>
                </div>

                {hospital.services?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">Layanan:</p>
                    <div className="flex flex-wrap gap-1">
                      {hospital.services.map((service) => (
                        <span
                          key={`${hospital.id}-${service}`}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hospital.doctors?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-1">Dokter:</p>
                    <ul className="list-disc pl-4 text-xs text-gray-700">
                      {hospital.doctors.map((doctor) => (
                        <li key={`${hospital.id}-${doctor}`}>{doctor}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/hospitals/${hospital.kode_rs}`}
                    className="w-1/2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs">
                      Detail
                    </button>
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hospital.name + " " + hospital.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs">
                      Map
                    </button>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
