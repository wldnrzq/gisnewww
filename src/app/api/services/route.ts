// app/src/api/service/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Logging untuk debugging
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hospitalId = searchParams.get("hospitalId");

    const hospitals = hospitalId
      ? await prisma.hospital.findUnique({
          where: { id: hospitalId },
          include: { services: { include: { service: true } } },
        })
      : await prisma.hospital.findMany({
          include: { services: { include: { service: true } } },
        });

    const transformedHospitals = Array.isArray(hospitals)
      ? hospitals.map((hospital) => ({
          kode_rs: hospital.id,
          nama: hospital.name,
          layanan: hospital.services.map((hs) => ({
            id: hs.service.id,
            name: hs.service.name,
            description: hs.service.description,
            icon: hs.service.icon,
          })),
        }))
      : hospitalId && hospitals
      ? [
          {
            kode_rs: hospitals.id,
            nama: hospitals.name,
            layanan: hospitals.services.map((hs) => ({
              id: hs.service.id,
              name: hs.service.name,
              description: hs.service.description,
              icon: hs.service.icon,
            })),
          },
        ]
      : [];

    console.log("Fetched hospitals from DB:", transformedHospitals); // Debugging
    return NextResponse.json(transformedHospitals);
  } catch (error: any) {
    console.error("Gagal ambil layanan:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { hospitalId, name, description, icon } = await req.json();

    console.log("Received data:", { hospitalId, name, description, icon }); // Debugging

    // Validasi input
    if (!hospitalId || !name) {
      return NextResponse.json(
        { error: "Hospital ID dan Nama Layanan wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah rumah sakit ada
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Rumah Sakit tidak ditemukan" },
        { status: 404 }
      );
    }

    let service;
    // Gunakan transaksi untuk memastikan semua operasi berhasil
    const result = await prisma.$transaction(
      async (tx) => {
        // Cari atau buat layanan
        service = await tx.service.findFirst({
          where: { name },
        });

        if (!service) {
          service = await tx.service.create({
            data: {
              name,
              description: description || "",
              icon: icon || "",
            },
          });
          console.log("Created new service with ID:", service.id);
        } else {
          console.log("Using existing service with ID:", service.id);
        }

        // Pastikan hubungan HospitalService ada
        const existingRelation = await tx.hospitalService.findUnique({
          where: {
            hospitalId_serviceId: { hospitalId, serviceId: service.id },
          },
        });

        if (!existingRelation) {
          await tx.hospitalService.create({
            data: {
              hospitalId,
              serviceId: service.id,
            },
          });
          console.log("Created new relation for service ID:", service.id);
        } else {
          console.log("Relation already exists for service ID:", service.id);
        }

        return service; // Kembalikan service untuk verifikasi
      },
      {
        isolationLevel: "Serializable", // Tambahkan isolasi untuk memastikan konsistensi
      }
    );

    // Verifikasi data di database setelah transaksi
    const verifiedService = await prisma.service.findUnique({
      where: { id: result.id },
    });

    if (!verifiedService) {
      throw new Error(
        "Gagal memverifikasi layanan di database setelah transaksi"
      );
    }

    // Verifikasi relasi juga
    const verifiedRelation = await prisma.hospitalService.findUnique({
      where: { hospitalId_serviceId: { hospitalId, serviceId: result.id } },
    });

    if (!verifiedRelation) {
      throw new Error("Gagal memverifikasi relasi HospitalService di database");
    }

    return NextResponse.json(
      {
        message: "Layanan berhasil ditambahkan",
        service: {
          id: verifiedService.id,
          name: verifiedService.name,
          description: verifiedService.description,
          icon: verifiedService.icon,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gagal menambahkan layanan:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { hospitalId, serviceId, name, description, icon } = await req.json();

    if (!hospitalId || !serviceId || !name) {
      return NextResponse.json(
        { error: "Hospital ID, Service ID, dan Nama Layanan wajib diisi" },
        { status: 400 }
      );
    }

    const hospitalService = await prisma.hospitalService.findUnique({
      where: { hospitalId_serviceId: { hospitalId, serviceId } },
    });

    if (!hospitalService) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan untuk rumah sakit ini" },
        { status: 404 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { name, description, icon },
    });

    return NextResponse.json(updatedService);
  } catch (error: any) {
    console.error("Gagal update layanan:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate layanan" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { hospitalId, serviceId } = await req.json();
  try {
    await prisma.hospitalService.delete({
      where: { hospitalId_serviceId: { hospitalId, serviceId } },
    });
    return NextResponse.json({ message: "Layanan dihapus" });
  } catch (error: any) {
    console.error("Gagal hapus layanan:", error);
    return NextResponse.json(
      { error: "Gagal menghapus layanan" },
      { status: 500 }
    );
  }
}
