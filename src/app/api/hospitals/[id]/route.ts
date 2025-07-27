import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Rumah sakit tidak ditemukan" },
        { status: 404 }
      );
    }

    const formatted = {
      kode_rs: hospital.id,
      nama: hospital.name,
      deskripsi: hospital.description || "",
      lokasi: {
        alamat: hospital.address,
        wilayah: hospital.region || "",
      },
      kontak: {
        telepon: hospital.phone,
        email: hospital.email || "",
      },
      koordinat: {
        lat: hospital.latitude,
        lng: hospital.longitude,
      },
      layanan: hospital.services.map((s) => s.service.name),
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching hospital:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { id } = params;

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

    const hospital = await prisma.hospital.update({
      where: { id },
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

    await prisma.hospitalService.deleteMany({
      where: { hospitalId: id },
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
            hospitalId: id,
            serviceId: service.id,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Rumah sakit berhasil diupdate", hospital },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating hospital:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate rumah sakit", detail: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.hospitalService.deleteMany({
      where: { hospitalId: id },
    });
    await prisma.hospital.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Rumah sakit berhasil dihapus" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting hospital:", error);
    return NextResponse.json(
      { error: "Gagal menghapus rumah sakit", detail: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
