import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Tambahkan logging Prisma
});

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      address,
      region,
      phone,
      email,
      website,
      latitude,
      longitude,
      operatingHours,
      services,
    } = body;

    if (!name || !address || !phone || !latitude || !longitude) {
      return NextResponse.json(
        {
          error:
            "Kolom wajib (name, address, phone, latitude, longitude) harus diisi",
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Latitude dan longitude harus berupa angka valid" },
        { status: 400 }
      );
    }

    if (!isValidCoordinate(lat, lng)) {
      return NextResponse.json(
        {
          error:
            "Koordinat tidak valid untuk wilayah Surabaya (latitude: -7.4 hingga -7.1, longitude: 112.6 hingga 112.8)",
        },
        { status: 400 }
      );
    }

    const existingHospital = await prisma.hospital.findFirst({
      where: { name },
    });
    if (existingHospital) {
      return NextResponse.json(
        { error: "Rumah sakit dengan nama ini sudah ada" },
        { status: 400 }
      );
    }

    const hospital = await prisma.hospital.create({
      data: {
        name,
        description: description || null,
        address,
        region: region || null,
        phone,
        email: email || null,
        website: website || null,
        latitude: lat,
        longitude: lng,
        operatingHours: operatingHours || null,
      },
    });

    if (services && Array.isArray(services) && services.length > 0) {
      for (const serviceName of services) {
        let service = await prisma.service.findUnique({
          where: { name: serviceName },
        });

        if (!service) {
          service = await prisma.service.create({
            data: {
              id: crypto.randomUUID(),
              name: serviceName,
              description: serviceName,
              icon: "🩺",
            },
          });
        }

        await prisma.hospitalService.create({
          data: {
            hospitalId: hospital.id,
            serviceId: service.id,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Berhasil ditambahkan", hospital },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding hospital:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan rumah sakit", detail: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest) {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    const formatted = hospitals
      .filter((h) => isValidCoordinate(h.latitude, h.longitude)) // Filter koordinat tidak valid
      .map((h) => ({
        kode_rs: h.id,
        nama: h.name,
        deskripsi: h.description || "",
        lokasi: {
          alamat: h.address,
          wilayah: h.region || "",
        },
        kontak: {
          telepon: h.phone,
          email: h.email || "",
        },
        koordinat: {
          lat: Number(h.latitude),
          lng: Number(h.longitude),
        },
        layanan: h.services.map((s) => s.service.name).filter(Boolean),
      }));

    console.log("GET /api/hospitals response:", formatted); // Logging untuk debugging
    return NextResponse.json(formatted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    console.error("Error fetching hospitals:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Gagal mengambil data rumah sakit", detail: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
