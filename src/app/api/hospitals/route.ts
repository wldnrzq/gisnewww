import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

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

    const formatted = hospitals.map((h) => ({
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
        lat: h.latitude,
        lng: h.longitude,
      },
      layanan: h.services.map((s) => s.service.name),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Gagal fetch data rumah sakit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
