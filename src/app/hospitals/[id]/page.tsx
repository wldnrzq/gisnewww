"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import hospitalsData from "@/data/hospitals.json";
import Link from "next/link";
import MainLayout from "../../../components/layout/MainLayout";
import dynamic from "next/dynamic";

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponentWithNoSSR = dynamic(
  () => import("../../../components/map/MapComponent"),
  { ssr: false }
);

// Define hospital interface
interface Hospital {
  id: number;
  kode_rs: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  services: string[];
  facilities: string[];
  doctors: Doctor[];
  rating: number;
  reviews: Review[];
  image: string;
  latitude: number;
  longitude: number;
  highlight?: boolean; // ✅ tambahkan properti ini
}

interface Doctor {
  id: number;
  name: string;
  image: string;
  specialty?: string;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

// Sample data for a hospital
const hospitals: Hospital[] = [
  {
    id: 1,
    kode_rs: "RS001",
    name: "RSUD Dr. Soetomo",
    address:
      "Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Kec. Gubeng, Kota Surabaya",
    phone: "(031) 5501078",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Poli Umum",
      "Poli Anak",
      "ICU",
      "Poli Jiwa",
      "Poli Gigi",
      "Poli Saraf",
      "Rawat Inap",
      "Poli Mata",
      "Poli THT-KL",
      "Poli Jantung",
      "Poli Kulit & Kelamin",
      "Poli Paru",
      "Ruang Isolasi",
      "Andrologi",
      "Toraks dan Kardiak",
      "ICU",
      "Radiologi",
      "Laboratorium",
      "Ruang Isolasi",
      "Layanan BPJS",
      "Medical Check-Up",
      "Anestesiologi dan Reanimasi",
      "Layanan Transplantasi",
      "Poli Bedah Umum",
      "Neurologi",
      "Kedokteran Fisik dan Rehabilitasi",
      "Kedokteran Jiwa",
      "Poli Penyakit Dalam",
      "Urologi",
      "Kesehatan THT-KL",
      "Mikrobiologi Klinik",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "Adi Wasis Prakosa, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 2,
        name: "Aditea Etnawati Putri, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 3,
        name: "Lenny Octavia, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 4,
        name: "Muhammad Noor Diansyah, dr., Sp.PD-KHOM., FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 5,
        name: "Pradana Zaky Romadhon, dr., Sp.PD-KHOM, FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 6,
        name: "Cahyo Wibisono Nugroho, dr., Sp.PD - KR., FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 7,
        name: "Yudhi Adrianto, dr., Sp.N (K)., FINR., FINA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 8,
        name: "Abdulloh Machin, dr., Sp.S (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 9,
        name: "Wardah Rahmatul Islamiyah, dr., Sp.N (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 10,
        name: "Dr. Kurnia Kusumastuti, dr., Sp.N (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 11,
        name: "Sita Setyowatie, dr., Sp.S",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 12,
        name: "Rendra Mahardhika Putra, dr., Sp. JP (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 13,
        name: "Nia Dyah R, dr., Sp.JP (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 14,
        name: "Dian Paramita Kartikasari, dr., Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 15,
        name: "Prastuti Asta Wulangingrum, dr., Sp.P (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 16,
        name: "Herley Windo Setiawan., dr., Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 17,
        name: "Alfian Nur Rosyid, dr., Sp.P (K), FAPSR, FCCP, FISR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 18,
        name: "Ariandi Setiawan, dr., Sp.B, Sp.BA (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Anak",
      },
      {
        id: 19,
        name: "Barmadisatrio, dr., Sp.B., Sp.BA (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Anak",
      },
      {
        id: 20,
        name: "Ismu Nugroho, dr., Sp.B-KBD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Digestif",
      },
      {
        id: 21,
        name: "Azril Okta Ardiansyah, dr., Sp.B(K)Onk",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Onkologi",
      },
      {
        id: 22,
        name: "Arga Patrianagara, dr., Sp.B(K)Onk",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Onkologi",
      },
      {
        id: 23,
        name: "Yunus, dr., Sp.OT(K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 24,
        name: "Faesal, dr., Sp.OT (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 25,
        name: "Bagus Wibowo Soetojo, dr., Sp.OT., M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 26,
        name: "Erreza Rahadiansyah, dr., Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 27,
        name: "Udria Satya Pratama, dr., Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 28,
        name: "Satriya Kelana, dr., Sp. B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 29,
        name: "Ricky Wibowo, dr., Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 30,
        name: "Danang Himawan Limanto, dr., Sp.BTKV",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 31,
        name: "Niko Azhari Hidayat, dr., Sp.BTKV (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 32,
        name: "Mohamad Rizki, dr., Sp.BTKV",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 33,
        name: "Izzatul Fithriyah, dr., Sp.KJ (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 34,
        name: "Andini Dyah Sitawati, dr., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 35,
        name: "Damba Bestari, dr., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 36,
        name: "Eccita Rahestyningtyas, dr., Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 37,
        name: "Jimmy Yanuar A, dr., Sp.OG (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 38,
        name: "Arif Tunjungseto, dr., Sp.OG., Subsp.F.E.R.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 39,
        name: "Muhammad Ardian Cahya Laksana, dr., Sp.OG (K)., M.Kes",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 40,
        name: "Maitri Anindita, dr., Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 41,
        name: "Muhammad Rizqy Abdullah, dr., Sp.M, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 42,
        name: "Mohamad Nurdin Zuhri, dr., Sp.M., FICS",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 43,
        name: "M. Ayodhia Soebadi, dr., Sp.U., Ph.D",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 44,
        name: "Lukman Hakim, dr., Sp.U, Ph.D, MARS (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 45,
        name: "Dimas Panca Andika, dr., Sp. U",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 46,
        name: "Rosa Falerina, dr., Sp. THT BKL, Subsp. NO (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 47,
        name: "Ami Pratami Munifah, dr., Sp. THT BK",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 48,
        name: "Elsa Rosalina, dr., Sp.T.H.T.B.K.L",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 49,
        name: "Hayyu Fath Rachmadhan, dr., Sp. THT BKL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 50,
        name: "Puguh Setyo Nugroho, dr., Sp. THT BKL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 51,
        name: "Mahendra Tri Arif Sampurna, dr., Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 52,
        name: "Robby Nurhariansyah, dr, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 53,
        name: "Achmad Yuniari Heryana, dr., Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 54,
        name: "Adityarani Putranti, drg., M.Kes",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 55,
        name: "Frans Ardany Dwi Wahyuningsih, drg., Sp.KG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 56,
        name: "Prof. Dr. Diah Savitri Ernawati, drg., M.Si., Sp.PM(K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 57,
        name: "Dr. Medhi Denisa Alinda, dr., Sp.DVE, Subsp.D.T",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 58,
        name: "Yuri Widia, dr., Sp.KK",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 59,
        name: "Dewi Nurasrifah, dr., Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 60,
        name: "Regitta Indira Agusni, dr., Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 61,
        name: "Bella Amanda, dr., Sp. And",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
      {
        id: 62,
        name: "Cennikon Pakpahan, dr., Sp. And",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
      {
        id: 63,
        name: "Agustinus, dr., Sp. And., Subsp. F.E.R (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/soeto.png",
    latitude: -7.267468,
    longitude: 112.757648,
  },
  {
    id: 2,
    kode_rs: "RS002",
    name: "Rumah Sakit Universitas Airlangga",
    address: "Jl. Mayjen Prof. Dr. Moestopo No. 47, Surabaya",
    phone: "+62 31 5501488",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Orthopaedi dan Traumatologi",
      "Periodontia",
      "Medical Check-Up",
      "Andrologi",
      "Diagnostik Lanjutan",
      "Rehabilitasi Medik",
      "Farmasi 24 Jam",
      "Klinik Jantung dan Pembuluh Darah",
      "Klinik Saraf",
      "Klinik Paru",
      "Klinik Jiwa",
      "Klinik Anak",
      "Klinik Penyakit Dalam",
      "Klinik Gigi dan Mulut",
      "Klinik Kulit dan Kelamin",
      "Klinik THT",
      "Layanan Kebidanan dan Kandungan (Obsgyn)",
      "Urologi",
      "Radiologi",
      "Anestesi dan Bedah TKV",
    ],

    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "Adi Wasis Prakosa, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 2,
        name: "Aditea Etnawati Putri, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 3,
        name: "Lenny Octavia, dr",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 4,
        name: "Muhammad Noor Diansyah, dr., Sp.PD-KHOM., FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 5,
        name: "Pradana Zaky Romadhon, dr., Sp.PD-KHOM, FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 6,
        name: "Cahyo Wibisono Nugroho, dr., Sp.PD - KR., FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 7,
        name: "Yudhi Adrianto, dr., Sp.N (K)., FINR., FINA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 8,
        name: "Abdulloh Machin, dr., Sp.S (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 9,
        name: "Wardah Rahmatul Islamiyah, dr., Sp.N (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 10,
        name: "Dr. Kurnia Kusumastuti, dr., Sp.N (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 11,
        name: "Sita Setyowatie, dr., Sp.S",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 12,
        name: "Rendra Mahardhika Putra, dr., Sp. JP (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 13,
        name: "Nia Dyah R, dr., Sp.JP (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 14,
        name: "Dian Paramita Kartikasari, dr., Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 15,
        name: "Prastuti Asta Wulangingrum, dr., Sp.P (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 16,
        name: "Herley Windo Setiawan., dr., Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 17,
        name: "Alfian Nur Rosyid, dr., Sp.P (K), FAPSR, FCCP, FISR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 18,
        name: "Ariandi Setiawan, dr., Sp.B, Sp.BA (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Anak",
      },
      {
        id: 19,
        name: "Barmadisatrio, dr., Sp.B., Sp.BA (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Anak",
      },
      {
        id: 20,
        name: "Ismu Nugroho, dr., Sp.B-KBD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Digestif",
      },
      {
        id: 21,
        name: "Azril Okta Ardiansyah, dr., Sp.B(K)Onk",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Onkologi",
      },
      {
        id: 22,
        name: "Arga Patrianagara, dr., Sp.B(K)Onk",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Onkologi",
      },
      {
        id: 23,
        name: "Yunus, dr., Sp.OT(K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 24,
        name: "Faesal, dr., Sp.OT (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 25,
        name: "Bagus Wibowo Soetojo, dr., Sp.OT., M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 26,
        name: "Erreza Rahadiansyah, dr., Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 27,
        name: "Udria Satya Pratama, dr., Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Ortopedi",
      },
      {
        id: 28,
        name: "Satriya Kelana, dr., Sp. B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 29,
        name: "Ricky Wibowo, dr., Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 30,
        name: "Danang Himawan Limanto, dr., Sp.BTKV",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 31,
        name: "Niko Azhari Hidayat, dr., Sp.BTKV (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 32,
        name: "Mohamad Rizki, dr., Sp.BTKV",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah TKV",
      },
      {
        id: 33,
        name: "Izzatul Fithriyah, dr., Sp.KJ (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 34,
        name: "Andini Dyah Sitawati, dr., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 35,
        name: "Damba Bestari, dr., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 36,
        name: "Eccita Rahestyningtyas, dr., Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 37,
        name: "Jimmy Yanuar A, dr., Sp.OG (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 38,
        name: "Arif Tunjungseto, dr., Sp.OG., Subsp.F.E.R.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 39,
        name: "Muhammad Ardian Cahya Laksana, dr., Sp.OG (K)., M.Kes",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Obsgyn",
      },
      {
        id: 40,
        name: "Maitri Anindita, dr., Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 41,
        name: "Muhammad Rizqy Abdullah, dr., Sp.M, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 42,
        name: "Mohamad Nurdin Zuhri, dr., Sp.M., FICS",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 43,
        name: "M. Ayodhia Soebadi, dr., Sp.U., Ph.D",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 44,
        name: "Lukman Hakim, dr., Sp.U, Ph.D, MARS (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 45,
        name: "Dimas Panca Andika, dr., Sp. U",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 46,
        name: "Rosa Falerina, dr., Sp. THT BKL, Subsp. NO (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 47,
        name: "Ami Pratami Munifah, dr., Sp. THT BK",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 48,
        name: "Elsa Rosalina, dr., Sp.T.H.T.B.K.L",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 49,
        name: "Hayyu Fath Rachmadhan, dr., Sp. THT BKL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 50,
        name: "Puguh Setyo Nugroho, dr., Sp. THT BKL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 51,
        name: "Mahendra Tri Arif Sampurna, dr., Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 52,
        name: "Robby Nurhariansyah, dr, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 53,
        name: "Achmad Yuniari Heryana, dr., Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 54,
        name: "Adityarani Putranti, drg., M.Kes",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 55,
        name: "Frans Ardany Dwi Wahyuningsih, drg., Sp.KG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 56,
        name: "Prof. Dr. Diah Savitri Ernawati, drg., M.Si., Sp.PM(K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi",
      },
      {
        id: 57,
        name: "Dr. Medhi Denisa Alinda, dr., Sp.DVE, Subsp.D.T",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 58,
        name: "Yuri Widia, dr., Sp.KK",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 59,
        name: "Dewi Nurasrifah, dr., Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 60,
        name: "Regitta Indira Agusni, dr., Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit Kelamin",
      },
      {
        id: 61,
        name: "Bella Amanda, dr., Sp. And",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
      {
        id: 62,
        name: "Cennikon Pakpahan, dr., Sp. And",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
      {
        id: 63,
        name: "Agustinus, dr., Sp. And., Subsp. F.E.R (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Andrologi",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/una.jpg",
    latitude: -7.267892,
    longitude: 112.758124,
  },
  {
    id: 3,
    kode_rs: "RS003",
    name: "Rumah Sakit Islam Surabaya",
    address: "Jl. Achmad Yani No. 2-4, Wonokromo, Surabaya",
    phone: "+62 31 8291920",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Penyakit Dalam",
      "Medical Check-Up",
      "Poli Kandungan",
      "Poli Laktasi",
      "Pemulasaran Jenazah",
      "Poliklinik Spesialis",
      "Urpologi",
      "Andrologi",
      "Radiologi",
      "Diagnostik Lanjutan",
      "Rehabilitasi Medik",
      "Layanan Bedah",
      "Farmasi",
      "Klinik Jantung",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Putri Ariska Anggraini",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 2,
        name: "dr. H. Mabruri",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 3,
        name: "drg. Fitriah Hasan Zaba",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi Umum",
      },
      {
        id: 4,
        name: "drg. Dian Permata Asri",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Gigi Umum",
      },
      {
        id: 5,
        name: "dr. Mery Susantri, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Anak",
      },
      {
        id: 6,
        name: "dr. Bony Pramono, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Anak",
      },
      {
        id: 7,
        name: "dr. Agus Budiarto, Sp.A, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Anak",
      },
      {
        id: 8,
        name: "dr. Effendi, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Penyakit Dalam",
      },
      {
        id: 9,
        name: "dr. Sheila Nalia, Sp.PD, FINASIM",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Penyakit Dalam",
      },
      {
        id: 10,
        name: "dr. Agus Prabowo, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Penyakit Dalam",
      },
      {
        id: 11,
        name: "dr. Novia Kusumawardhani, Sp.JP, FIHA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung dan Pembuluh Darah",
      },
      {
        id: 12,
        name: "dr. Farhanah Meutia, Sp.JP(K), FIHA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung dan Pembuluh Darah",
      },
      {
        id: 13,
        name: "Dr. dr. Andrianto, Sp.JP, Subsp.IKKV(K), FIHA, FAsCC, FAPSC, FESC",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung dan Pembuluh Darah",
      },
      {
        id: 14,
        name: "dr. Nur Indah Sawitri, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 15,
        name: "dr. Aries Subianto, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 16,
        name: "dr. Titin Sholihah Agustina, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 17,
        name: "dr. Hartatiek Nila Karmila, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Kandungan",
      },
      {
        id: 18,
        name: "dr. Almira Aulia Shahnaz, Sp.OG, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Kandungan",
      },
      {
        id: 19,
        name: "dr. Dahlia Ningrum, Sp.OG, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Kandungan",
      },
      {
        id: 20,
        name: "dr. Dayu Satriya Wibawa, Sp.B, FINACS",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Bedah Umum",
      },
      {
        id: 21,
        name: "dr. Sigit Wijanarko, Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Bedah Umum",
      },
      {
        id: 22,
        name: "dr. Faradina Sulistiyani, Sp.B, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Bedah Umum",
      },
      {
        id: 23,
        name: "dr. Donny Permana, Sp.OT, AIFO-K, FICS",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthopaedi dan Traumatologi",
      },
      {
        id: 24,
        name: "dr. Yusuf Rizal, M.Ked.Klin, Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthopaedi dan Traumatologi",
      },
      {
        id: 25,
        name: "dr. Febrian Brahmana, M.Ked.Klin, Sp.OT, Subsp.PL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthopaedi dan Traumatologi",
      },
      {
        id: 26,
        name: "dr. Wisnu Laksmana, Sp.U",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Urologi",
      },
      {
        id: 27,
        name: "dr. Ariyo Sakso Bintoro, Sp.U",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Urologi",
      },
      {
        id: 28,
        name: "dr. El-Dien Muhammad Shidqy, Sp.U, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Urologi",
      },
      {
        id: 29,
        name: "dr. Rosy Nur Febriani, Sp.And",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Andrologi",
      },
      {
        id: 30,
        name: "dr. Nur Azizah AS, Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 31,
        name: "dr. Khairunnisa, Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 32,
        name: "dr. Nining Febriyana, Sp.KJ, Subsp.A.R (K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kedokteran Jiwa",
      },
      {
        id: 33,
        name: "dr. Vita Pradiptya, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 34,
        name: "dr. Ki Ajeng Winda Ningrum Prinasetya, Sp.M, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 35,
        name: "dr. Ita Permatasari, Sp.M, M.Biomed",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 36,
        name: "drg. Febria Desi Kriswulan H, Sp.Perio",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Periodontia",
      },
      {
        id: 37,
        name: "dr. Erriza Shalahuddin, Sp.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Radiologi",
      },
      {
        id: 38,
        name: "dr. Prima Roosandris, Sp.PA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Patologi Anatomi",
      },
      {
        id: 39,
        name: "Dr. dr. Willy Sandhika, M.Si, Sp.PA(K)",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Patologi Anatomi",
      },
      {
        id: 40,
        name: "Dr. dr. Etty Hary Kusumastuti, Sp.PA, Subsp.S.P(K), FIAC",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Patologi Anatomi",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/rsi.png",
    latitude: -7.315427,
    longitude: 112.735689,
  },
  {
    id: 4,
    kode_rs: "RS004",
    name: "Rumah Sakit Angkatan Laut Dr. Ramelan (RSAL)",
    address: "Jl. Gadung No. 1, Surabaya",
    phone: "+62 31 5501488",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poliklinik Penyakit Dalam",
      "Poliklinik Bedah Umum",
      "Poliklinik Anak",
      "Poliklinik Kebidanan dan Kandungan",
      "Poliklinik Saraf",
      "Poliklinik Mata",
      "Poliklinik THT-KL",
      "Poliklinik Kulit dan Kelamin",
      "Poliklinik Psikiatri",
      "Poliklinik Paru",
      "Poliklinik Jantung dan Pembuluh Darah",
      "Poliklinik Gigi dan Mulut",
      "Poliklinik Bedah Ortopedi",
      "Poliklinik Urologi",
      "Poliklinik Bedah Saraf",
      "Poliklinik Onkologi",
      "Poliklinik Rehabilitasi Medik",
      "Poliklinik Endokrin",
      "Poliklinik Geriatri",
      "Poliklinik Gizi Klinik",
      "Poliklinik Bedah Plastik dan Estetika",
      "Medical Check-Up",
      "CT Scan",
      "MRI",
      "USG 4D",
      "USG 3D/2D",
      "Rontgen / X-Ray",
      "Elektrokardiografi (EKG)",
      "Elektroensefalografi (EEG)",
      "Endoskopi",
      "Treadmill Test (Uji Latih Jantung)",
      "Laboratorium Klinik",
      "Laboratorium Mikrobiologi",
      "Laboratorium Patologi Anatomi",
      "Laboratorium Patologi Klinik",
      "Rehabilitasi Medik",
      "Bedah Umum",
      "Bedah Mata",
      "Bedah Onkologi",
      "Bedah Ortopedi",
      "Bedah Saraf",
      "Bedah Plastik dan Estetika",
      "Bedah THT",
      "Bedah Urologi",
      "Bedah Digestif",
      "Bedah Anak",
      "Bedah Gigi dan Mulut",
      "Farmasi",
      "Klinik Jantungan",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Hendy Bhaskara",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 2,
        name: "dr. Akhmad Rofiq",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 3,
        name: "dr. Muhammad Rizky Ramadhani",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 4,
        name: "dr. Moh Samsudin, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 5,
        name: "dr. Trisna Rini, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 6,
        name: "dr. Amir Surya, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Mata",
      },
      {
        id: 7,
        name: "dr. Agus Widodo, Sp.T.H.TB.K.L",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter THT",
      },
      {
        id: 8,
        name: "dr. Pudjo, Sp.T.H.TB.K.L",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter THT",
      },
      {
        id: 9,
        name: "dr. Chonifa W., Sp.T.H.TB.K.L",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter THT",
      },
      {
        id: 10,
        name: "dr. Diah Mustika Hesti W., Sp.S., KIC",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Saraf",
      },
      {
        id: 11,
        name: "dr. Diah Utari, Sp.S",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Saraf",
      },
      {
        id: 12,
        name: "dr. Ni Komang S.D.U., M.Kes, Sp.S",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Saraf",
      },
      {
        id: 13,
        name: "dr. Lena W., Sp.KFR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Rehabilitasi Medik",
      },
      {
        id: 14,
        name: "dr. Marcus Anthoius, Sp.KFR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Rehabilitasi Medik",
      },
      {
        id: 15,
        name: "dr. Eka Poerwanto, Sp.KFR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Rehabilitasi Medik",
      },
      {
        id: 16,
        name: "dr. I Putu Eka S., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Psikiatri",
      },
      {
        id: 17,
        name: "dr. Ade Irawati, Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Psikiatri",
      },
      {
        id: 18,
        name: "dr. Sadya Wendra, Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Psikiatri",
      },
      {
        id: 19,
        name: "drg. Slamet Sutomo, Dipl.C.E., Sp.Ort",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthodontia",
      },
      {
        id: 20,
        name: "drg. Agung Wijayadi, Sp.Ort",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthodontia",
      },
      {
        id: 21,
        name: "drg. Savitri Hapsati, Sp.Ort",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Orthodontia",
      },
      {
        id: 22,
        name: "dr. R. Rukma Juslim, Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung",
      },
      {
        id: 23,
        name: "dr. Sri Maharani, Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung",
      },
      {
        id: 24,
        name: "dr. Tjatur Bagus G., Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Jantung",
      },
      {
        id: 25,
        name: "dr. Sri Sarwosih Indah M., Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 26,
        name: "dr. Rike Andy Wijaya, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 27,
        name: "dr. Vinodini Merinda, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Paru",
      },
      {
        id: 28,
        name: "dr. Hezron Ginting, Sp.Onk.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Radioterapi",
      },
      {
        id: 29,
        name: "dr. Siti Khotimah, Sp.Rad(K) Onk.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Radioterapi",
      },
      {
        id: 30,
        name: "dr. Wayan Maha P., Sp.Rad(K) Onk.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Radioterapi",
      },
      {
        id: 31,
        name: "drg. Paulus B. Teguh, Sp.Pros",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Prostodonsia",
      },
      {
        id: 32,
        name: "drg. Widaningsih, Sp.Pros",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Prostodonsia",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/rsal.png",
    latitude: -7.235678,
    longitude: 112.785432,
  },
  {
    id: 5,
    kode_rs: "RS005",
    name: "Rumah Sakit Wiyung Sejahtera",
    address: "Jl. Raya Menganti Wiyung No. 27, Surabaya",
    phone: "+62 31 7532777",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Poli Anak",
      "Poli Interna (Penyakit Dalam)",
      "Poli Radiologi",
      "Poli Rehabilitasi Medik",
      "Poli Bedah Umum",
      "Poli Ortopedi",
      "Poli Kulit dan Kelamin",
      "Poli Mata",
      "Poli Jantung",
      "Poli Urologi",
      "Poli Saraf",
      "Poli Kebidanan dan Kandungan",
      "Poli Gigi",
      "Poli Gigi Spesialis",
      "Poli Paru",
      "Poli THT",
      "Poli Psikiatri",
      "Medical Check-Up",
      "CT Scan",
      "MRI",
      "USG 4D",
      "Rontgen / Foto Thorax",
      "Laboratorium Klinik 24 Jam",
      "Laboratorium Mikrobiologi",
      "Laboratorium Patologi Klinik",
      "Elektrokardiografi (EKG)",
      "Endoskopi",
      "Medical Check-Up (MCU)",
      "Rehabilitasi Medik",
      "Farmasi",
      "Klinik Jantungan",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Anis Amiranti, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 2,
        name: "dr. Robby Nurhariansyah, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 3,
        name: "dr. Sitti Radhiah, Sp.A(K), Neurologi Anak",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 4,
        name: "dr. Anita W., Sp.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Radiologi",
      },
      {
        id: 5,
        name: "dr. Fierly Hayati, Sp.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Radiologi",
      },
      {
        id: 6,
        name: "dr. Qonita, Sp.Rad",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Radiologi",
      },
      {
        id: 7,
        name: "dr. Sri Harnowo, Sp.KFR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Rehabilitasi Medik",
      },
      {
        id: 8,
        name: "dr. H. Ach. Hendra HW, M.Si., Sp.B, FInaCS, FICS",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 9,
        name: "dr. Putra Gelar Parlindungan, Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah Umum",
      },
      {
        id: 10,
        name: "dr. Faried Himawan, Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Ortopedi",
      },
      {
        id: 11,
        name: "dr. Didyn Nuzul Ariefin, Sp.OT(K)Hip and Knee",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Ortopedi",
      },
      {
        id: 12,
        name: "dr. Yunia Eka Safitri, Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit dan Kelamin",
      },
      {
        id: 13,
        name: "dr. Dyah Ratri, Sp.DV, FINSDV",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kulit dan Kelamin",
      },
      {
        id: 14,
        name: "dr. Boedy Widyaningsih, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Mata",
      },
      {
        id: 15,
        name: "dr. Arief Hidayat, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Mata",
      },
      {
        id: 16,
        name: "dr. Anggasta Vasthi, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Mata",
      },
      {
        id: 17,
        name: "dr. Donny Hendrasto, Sp.JP (K) FIHA",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 18,
        name: "dr. Diah Masita Cahyani, Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 19,
        name: "dr. Anudya Kartika Ratri, Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Jantung",
      },
      {
        id: 20,
        name: "dr. Raditya, Sp.U",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Urologi",
      },
      {
        id: 21,
        name: "dr. Djohan Ardiansyah, Sp.S",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Syaraf",
      },
      {
        id: 22,
        name: "dr. Nina Devi Indrawati, Sp.N",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Syaraf",
      },
      {
        id: 23,
        name: "dr. Ninuk Dwi A., Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 24,
        name: "dr. Harnoprihadi, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 25,
        name: "dr. Henky Mohammad Masteryanto, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 26,
        name: "dr. Khoirunnisa Novitasari, Sp.OG, M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 27,
        name: "drg. Nikko Kristiana Paramitha",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Gigi",
      },
      {
        id: 28,
        name: "drg. Lisa Desi Puspasari",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Gigi",
      },
      {
        id: 29,
        name: "drg. Andri Yuliprasetyo, M.Kes",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Gigi",
      },
      {
        id: 30,
        name: "dr. Fitri Sriyani, Sp.P",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Paru",
      },
      {
        id: 31,
        name: "dr. Puguh Setyo Nugroho, Sp.THT-KL",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "THT",
      },
      {
        id: 32,
        name: "dr. Adianti Handajani, M.Kes., Sp.KJ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Psikiatri",
      },
    ],

    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/rsadi.png",
    latitude: -7.316543,
    longitude: 112.674128,
  },
  {
    id: 6,
    kode_rs: "RS006",
    name: "Rumah Sakit Muji Rahayu",
    address: "Jl. Raya Manukan Kulon No. 66, Surabaya",
    phone: "+62 31 7417171",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "IGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Penyakit Dalam",
      "Anak (Pediatri)",
      "Bedah Umum",
      "Kandungan & Kebidanan (Obstetri & Ginekologi)",
      "Mata (Oftalmologi)",
      "Orthopedi",
      "Saraf (Neurologi)",
      "Jantung & Pembuluh Darah (Kardiologi)",
      "Paru (Pulmonologi)",
      "THT",
      "Radiologi",
      "Patologi Klinik",
      "Rehabilitasi Medik",
      "Kedokteran Fisik dan Rehabilitasi Medik",
      "Gigi & Mulut (Spesialis / Konservasi Gigi)",
      "Anestesi (Penunjang)",
      "KIA/KB (Perinatologi)",
      "Mata Subspesialis (Katarak, Retina, Strabismus, dll.)",
      "Spine, Hand, Micro Surgery",
      "Lower Extremity Surgery (Hip & Knee)",
      "Stroke & Cerebrovaskular",
      "Medical Check-Up",
      "Rehabilitasi Medik",
      "Farmasi",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Bilqis Fiqotun Nabila",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Umum",
      },
      {
        id: 2,
        name: "drg. Putu Yuri Divina, Sp.KG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Konservasi Gigi",
      },
      {
        id: 3,
        name: "dr. Arief Wijaya Roesli, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 4,
        name: "dr. Agus Cahyono, Sp.A",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 5,
        name: "dr. Iskandar Arifin, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 6,
        name: "dr. Soffy Enggar Rakhmadanti, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 7,
        name: "dr. Pieter David Adriaan, Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah",
      },
      {
        id: 8,
        name: "dr. Rachma Wulan Pratiwi S, Sp.OG., M.Ked.Klin",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 9,
        name: "dr. Irfan Reza Primadi, Sp.M",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Mata",
      },
      {
        id: 10,
        name: "dr. Tanjung Arfaksad, Sp.OT",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Orthopedi",
      },
      {
        id: 11,
        name: "dr. Edfina Rahmarini, Sp.N",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Saraf",
      },
      {
        id: 12,
        name: "dr. Nur Khozin, Sp.KFR",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Rehabilitasi Medik",
      },
    ],

    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/muji.png",
    latitude: -7.256789,
    longitude: 112.678234,
  },
  {
    id: 7,
    kode_rs: "RS007",
    name: "RSUD Husada Prima",
    address: "Jl. Karang Tembok No. 39, Surabaya",
    phone: "031-3713839",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "IGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Penyakit Dalam",
      "Bedah Umum",
      "Obstetri dan Ginekologi (Kandungan)",
      "Anestesiologi",
      "Radiologi",
      "Patologi Klinik",
      "Mata (Oftalmologi)",
      "THT-KL (Telinga Hidung Tenggorok Kepala & Leher)",
      "Kulit dan Kelamin",
      "Paru (Pulmonologi / Paru)",
      "Orthopedi",
      "Jantung dan Pembuluh Darah (Kardiologi)",
      "Gigi dan Mulut (Konservasi / Endodonti, Prosthodonti)",
      "Elektromedik Diagnostik (EKG, EEG, Brain Mapping)",
      "Rehabilitasi Medik",
      "Geriatri",
      "Bedah Thorax, Kardiak dan Vaskuler",
      "Neurologi (Saraf)",
      "Onkologi (subspesialis Kanker)",
      "Bedah Onkologi",
      "Sub-spesialis Ortopsi / Tulang",
      "Sub-spesialis Saraf / Stroke",
      "Medical Check-Up",
      "CT Scan (multi-slice/spiral)",
      "MRI (Magnetic Resonance Imaging)",
      "USG (termasuk USG 4D pada obstetri & onkologi)",
      "Rontgen / Foto Thorax",
      "Laboratorium Klinik 24 Jam",
      "Laboratorium Mikrobiologi",
      "Patologi Klinik",
      "Elektrokardiografi (EKG)",
      "Elektroensefalografi (EEG)",
      "Medical Check-Up (MCU)",
      "Rehabilitasi Medik",
      "Farmasi",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Ergia Latifolia, Sp A",
        image: "https://placehold.co/100x100?text=Dokter",
      },
      {
        id: 2,
        name: "dr. Chairun Nur Prasetya Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
      },
      {
        id: 3,
        name: "dr. Achmadi, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/husada.jpg",
    latitude: -7.234567,
    longitude: 112.759812,
  },
  {
    id: 8,
    kode_rs: "RS008",
    name: "RS PKU Muhammadiyah Surabaya",
    address:
      "Jl. Raya Sutorejo No. 64, Dukuh Sutorejo, Kec. Mulyorejo, Surabaya",
    phone: "031-5939933",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Spesialis Anak",
      "Spesialis Gigi",
      "Spesialis Kandungan",
      "Spesialis Penyakit Dalam",
      "Spesialis Bedah Umum",
      "Spesialis Jantung (Kardiologi)",
      "Spesialis Saraf (Neurologi)",
      "Spesialis Kulit & Kelamin",
      "USG 4D",
      "X‑Ray / Rontgen Konvensional",
      "Laboratorium Klinik",
      "Radiologi",
      "Radioterapi",
      "Medical Check-Up (MCU)",
      "IGD 24 Jam",
      "Kamar Operasi",
      "Rehabilitasi Medik",
      "Farmasi",
      "Poli Jantung",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Suraiya, Sp.OG.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 2,
        name: "dr. Ninuk Dwi Ariningtyas, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Kandungan",
      },
      {
        id: 3,
        name: "dr. M. Dwinanda Junaidi, Sp.OG",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "kandungan",
      },
      {
        id: 4,
        name: "dr. Ahmad Assegaf, Sp.A.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 5,
        name: "dr. Delfia Rahmat Gozali, Sp.A.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Anak",
      },
      {
        id: 6,
        name: "dr. Faizal Armando, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 7,
        name: "dr. Bagus Aulia Mahdi, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 8,
        name: "ddr. Reza Felani, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Penyakit Dalam",
      },
      {
        id: 9,
        name: "dr. Yahya, Sp.N.",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Syaraf",
      },
      {
        id: 10,
        name: "dr. Agus Maulana, Sp.B",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Bedah",
      },
      {
        id: 11,
        name: "dr.Dewi Nurasrifah, Sp.DVE",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "SPESIALIS KULIT & KELAMIN",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/pku.png",
    latitude: -7.230456,
    longitude: 112.780123,
  },
  {
    id: 9,
    kode_rs: "RS009",
    name: "Rumah Sakit Surabaya Medical Service",
    address: "Jl. Kapuas No.2, Keputran, Kec. Tegalsari, Surabaya",
    phone: "031-5686161",
    operatingHours: "24 Jam",
    services: [
      "UGD 24 Jam",
      "Rawat Inap",
      "Rawat Jalan",
      "Penyakit Dalam",
      "Anak (Pediatri)",
      "Obstetri dan Ginekologi (Kandungan)",
      "Bedah Umum",
      "Orthopedi",
      "Mata (Oftalmologi)",
      "THT (Telinga Hidung Tenggorok Kepala & Leher)",
      "Saraf (Neurologi)",
      "Medik Dasar / Umum",
      "Medik Gigi & Mulut",
      "Medical Check-Up",
      "Laboratorium Klinik",
      "Radiologi / Rontgen",
      "Medical Check-Up (MCU)",
      "IGD 24 Jam",
      "Ruang Operasi / Bedah",
      "Layanan Anestesiologi & Penunjang Bedah",
      "Rehabilitasi Medik",
      "Farmasi",
    ],
    facilities: [
      "Parkir Luas",
      "Kantin",
      "ATM Center",
      "Apotek",
      "Mushola",
      "Wifi",
      "Ambulance",
    ],
    doctors: [
      {
        id: 1,
        name: "dr. Ira Yunita, Sp. D.V.E ",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Spesialis Dermatologi, Venereologi, dan Estetika",
      },
      {
        id: 2,
        name: "dr. Wisda Medika V., Sp.JP",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "Dokter Dokter Spesialis Jantung",
      },
      {
        id: 3,
        name: "Atina Irani Wira Putri, Sp.PD",
        image: "https://placehold.co/100x100?text=Dokter",
        specialty: "kusus penyakit dalam",
      },
    ],
    rating: 4.5,
    reviews: [
      {
        id: 1,
        user: "Ahmad",
        rating: 5,
        comment:
          "Pelayanan sangat baik dan cepat. Dokter dan perawat sangat profesional.",
        date: "12 Mei 2023",
      },
      {
        id: 2,
        user: "Budi",
        rating: 4,
        comment: "Fasilitas lengkap dan bersih. Antrian cukup teratur.",
        date: "23 April 2023",
      },
      {
        id: 3,
        user: "Citra",
        rating: 4,
        comment:
          "Dokter sangat informatif dan menjelaskan dengan detail. Hanya saja waktu tunggu cukup lama.",
        date: "5 Maret 2023",
      },
    ],
    image: "/image/mdical.jpg",
    latitude: -7.261354,
    longitude: 112.737942,
  },
];

export default function HospitalDetailPage() {
  const params = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    // Cari RS sesuai id dari URL
    const found = hospitals.find((rs) => rs.kode_rs === params.id);

    setHospital(found || null);
  }, [params.id]);

  if (!hospital) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Rumah Sakit tidak ditemukan.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2.5 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all duration-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white transition-transform duration-200 group-hover:-translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base">
              Kembali ke Daftar Rumah Sakit
            </span>
          </Link>
        </div>


        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8">
          <div className="relative h-48 sm:h-64 md:h-96 lg:h-[500px]">
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-full object-cover object-center rounded-b-none"
              style={{ imageRendering: "auto" }}
            />
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {hospital.name}
                </h1>
                <p className="flex items-start text-text-secondary text-sm sm:text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {hospital.address}
                </p>
              </div>

              <div className="flex items-center">
                <div className="flex text-yellow-400 items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(hospital.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                        }`}
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    {hospital.rating}/5 ({hospital.reviews.length} ulasan)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 scrollbar-hide">
              <div className="flex border-b border-gray-200 space-x-1 sm:space-x-0">
                <button
                  className={`px-3 py-1 sm:px-4 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "info"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("info")}>
                  Informasi
                </button>
                <button
                  className={`px-3 py-1 sm:px-4 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "services"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("services")}>
                  Layanan & Fasilitas
                </button>
                <button
                  className={`px-3 py-1 sm:px-4 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "doctors"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("doctors")}>
                  Dokter
                </button>
                <button
                  className={`px-3 py-1 sm:px-4 sm:py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "reviews"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("reviews")}>
                  Ulasan
                </button>
              </div>
            </div>

            {activeTab === "info" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      Informasi Kontak
                    </h2>
                    <p className="flex items-start mb-2 sm:mb-3 text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {hospital.phone}
                    </p>
                    <p className="flex items-start mb-2 sm:mb-3 text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {hospital.operatingHours}
                    </p>
                    <p className="flex items-start text-sm sm:text-base">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <a href="#" className="text-primary">
                        Kunjungi Website
                      </a>
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      Lokasi
                    </h2>
                    <div className="h-48 sm:h-64 rounded-lg overflow-hidden">
                      <MapComponentWithNoSSR
                        height="100%"
                        hospitals={[
                          {
                            id: hospital.id.toString(),
                            kode_rs: hospital.kode_rs,
                            name: hospital.name,
                            address: hospital.address,
                            latitude: hospital.latitude,
                            longitude: hospital.longitude,
                            services: hospital.services,
                            rating: hospital.rating,
                            doctors: [],
                          },
                        ]}
                        showUserLocation={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Tentang {hospital.name}
                  </h2>
                  <p className="text-text-secondary text-sm sm:text-base mb-3 sm:mb-4">
                    {hospital.name} adalah salah satu rumah sakit terkemuka di
                    Surabaya yang menyediakan layanan kesehatan komprehensif
                    dengan standar kualitas tinggi. Rumah sakit ini dilengkapi
                    dengan fasilitas modern dan didukung oleh tim medis yang
                    profesional dan berpengalaman.
                  </p>
                  <p className="text-text-secondary text-sm sm:text-base">
                    Dengan komitmen untuk memberikan pelayanan terbaik,{" "}
                    {hospital.name} terus meningkatkan kualitas layanan dan
                    fasilitas untuk memenuhi kebutuhan kesehatan masyarakat
                    Surabaya dan sekitarnya.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      Layanan
                    </h2>
                    <ul className="space-y-1 sm:space-y-2">
                      {hospital.services.map((service, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm sm:text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                      Fasilitas
                    </h2>
                    <ul className="space-y-1 sm:space-y-2">
                      {hospital.facilities.map((facility, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm sm:text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {facility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "doctors" &&
              hospital.doctors &&
              hospital.doctors.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                    Dokter
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {hospital.doctors.map((doctor) => (
                      <div key={doctor.id} className="text-center">
                        <div className="mb-2 sm:mb-3 mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-sm sm:text-base">
                          {doctor.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {doctor.specialty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {activeTab === "reviews" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Ulasan ({hospital.reviews.length})
                  </h2>
                  <button className="btn-primary text-xs sm:text-sm py-1 sm:py-2 px-3 sm:px-4">
                    Tulis Ulasan
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {hospital.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 sm:pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-sm sm:text-base">
                          {review.user}
                        </h3>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                              }`}
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-text-secondary text-sm sm:text-base">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
