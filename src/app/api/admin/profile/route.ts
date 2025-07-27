import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "C7A7D98E9F6FEE43FB4AC51AE43FC"
);

// Handler untuk GET
export async function GET(req: Request) {
  try {
    // Ambil token dari header Authorization atau cookie
    let token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      token = req.headers.get("cookie")?.match(/adminToken=([^;]+)/)?.[1];
    }
    console.log("Token received:", token); // Debugging

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    let payload;
    try {
      const { payload: decoded } = await jwtVerify(token, JWT_SECRET);
      payload = decoded;
      console.log("JWT Payload:", payload); // Debugging
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: payload.userId, role: "ADMIN" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (error: any) {
    console.error("Gagal mengambil data profil:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Handler untuk PUT (update profil)
export async function PUT(req: Request) {
  try {
    const { name, email, password } = await req.json();
    console.log("Update request:", { name, email, password }); // Debugging

    // Ambil token dari header Authorization atau cookie
    let token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      token = req.headers.get("cookie")?.match(/adminToken=([^;]+)/)?.[1];
    }
    console.log("Token received:", token); // Debugging

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    let payload;
    try {
      const { payload: decoded } = await jwtVerify(token, JWT_SECRET);
      payload = decoded;
      console.log("JWT Payload:", payload); // Debugging
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: payload.userId, role: "ADMIN" },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    // Persiapkan data untuk update
    const updateData: any = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Hash password jika diubah
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedAdmin);
  } catch (error: any) {
    console.error("Gagal memperbarui profil:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
