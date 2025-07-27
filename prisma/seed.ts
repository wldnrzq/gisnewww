import { PrismaClient } from "@prisma/client";
import hospitalsData from "data/hospital.json";

const prisma = new PrismaClient();

async function main() {
  for (const hospital of hospitalsData.rumah_sakit) {
    // Buat atau temukan hospital
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: hospital.kode_rs },
    });

    if (!existingHospital) {
      await prisma.hospital.create({
        data: {
          id: hospital.kode_rs,
          name: hospital.nama,
          address: hospital.lokasi.alamat,
          phone: hospital.kontak.telepon,
          email: hospital.kontak.email || null,
          description: hospital.deskripsi,
          latitude: hospital.koordinat.lat,
          longitude: hospital.koordinat.lng,
          region: hospital.lokasi.wilayah,
        },
      });
      console.log(`Created hospital: ${hospital.nama}`);
    }

    // Buat layanan jika belum ada
    for (const serviceName of hospital.layanan) {
      let service = await prisma.service.findFirst({
        where: { name: serviceName },
      });

      if (!service) {
        service = await prisma.service.create({
          data: {
            name: serviceName,
            description: serviceName, // Gunakan nama sebagai deskripsi sementara
            icon: "fa-hospital", // Default icon
          },
        });
        console.log(`Created service: ${serviceName}`);
      }

      // Buat relasi HospitalService
      const existingRelation = await prisma.hospitalService.findUnique({
        where: {
          hospitalId_serviceId: {
            hospitalId: hospital.kode_rs,
            serviceId: service.id,
          },
        },
      });

      if (!existingRelation) {
        await prisma.hospitalService.create({
          data: {
            hospitalId: hospital.kode_rs,
            serviceId: service.id,
          },
        });
        console.log(`Created relation for service: ${serviceName}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
