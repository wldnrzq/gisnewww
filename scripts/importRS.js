const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const raw = JSON.parse(fs.readFileSync("data/hospitals.json", "utf-8"));
  const data = raw.rumah_sakit; // Ambil array-nya dari properti "rumah_sakit"

  for (const rs of data) {
    const hospitalId = rs.kode_rs;
    const { nama, deskripsi, lokasi, kontak, koordinat, layanan } = rs;

    // Insert atau update ke tabel Hospital
    await prisma.hospital.upsert({
      where: { id: hospitalId },
      update: {
        name: nama,
        address: lokasi.alamat,
        phone: kontak.telepon,
        email: kontak.email,
        description: deskripsi,
        latitude: koordinat.lat,
        longitude: koordinat.lng,
        region: lokasi.wilayah || null, // Tambahkan ini jika pakai region
      },
      create: {
        id: hospitalId,
        name: nama,
        address: lokasi.alamat,
        phone: kontak.telepon,
        email: kontak.email,
        description: deskripsi,
        latitude: koordinat.lat,
        longitude: koordinat.lng,
        region: lokasi.wilayah || null,
      },
    });

    // Loop layanan
    for (const namaLayanan of layanan) {
      const serviceId = namaLayanan
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

      // Insert atau update ke tabel Service
      await prisma.service.upsert({
        where: { id: serviceId },
        update: {},
        create: {
          id: serviceId,
          name: namaLayanan,
          description: namaLayanan,
          icon: "fa-hospital",
        },
      });

      // Insert ke tabel HospitalService (relasi)
      await prisma.hospitalService.upsert({
        where: {
          hospitalId_serviceId: {
            hospitalId: hospitalId,
            serviceId: serviceId,
          },
        },
        update: {},
        create: {
          hospitalId: hospitalId,
          serviceId: serviceId,
        },
      });
    }

    console.log(`✅ Rumah sakit ${nama} berhasil diimpor beserta layanannya.`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error saat import data:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
