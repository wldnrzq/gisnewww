import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalHospitals = await prisma.hospital.count();
    const totalUsers = await prisma.user.count();
    const totalServices = await prisma.service.count(); // ini bagian penting

    const recentActivity = await prisma.activity.findMany({
      orderBy: { timestamp: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalHospitals,
      totalServices,
      totalUsers,
      recentActivity,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Gagal memuat statistik", error },
      { status: 500 }
    );
  }
}
