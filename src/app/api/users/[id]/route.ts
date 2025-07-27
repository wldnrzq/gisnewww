import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, email, password, role } = await req.json();
    const data: any = { name, email, role };
    if (password) data.password = password; // Hanya update password jika diisi

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message.includes("Unique constraint")
          ? "Email sudah digunakan"
          : error.message,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Pengguna dihapus" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal menghapus pengguna" },
      { status: 500 }
    );
  }
}
