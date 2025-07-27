"use client";

import L from "leaflet";

// Create custom icon for hospital markers
export const hospitalIcon = L.icon({
  iconUrl: "/hospital.svg",
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.svg",
  shadowSize: [41, 41],
});

// Create custom icon for user location
export const userLocationIcon = L.icon({
  iconUrl: "/user.svg",
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.svg",
  shadowSize: [41, 41],
});
