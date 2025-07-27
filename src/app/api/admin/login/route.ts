import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const prisma = new PrismaClient();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "C7A7D98E9F6FEE43FB4AC51AE43FC"
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt:", { email }); // Debugging

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user); // Debugging

    if (!user || user.role !== "ADMIN") {
      console.log("User not found or not ADMIN");
      return NextResponse.json({ error: "Akses ditolak!" }, { status: 403 });
    }

    if (!user.password) {
      console.log("Password is null or undefined");
      return NextResponse.json(
        { error: "Data pengguna tidak lengkap" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isValid); // Debugging

    if (!isValid) {
      return NextResponse.json({ error: "Kata sandi salah" }, { status: 401 });
    }

    // Buat JWT dengan jose
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Set cookie dengan token
    const response = NextResponse.json(
      { success: true, token },
      { status: 200 }
    );
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 24 jam
      path: "/",
      sameSite: "strict",
    });
    console.log("Cookie set:", { name: "adminToken", value: token }); // Debugging

    return response;
  } catch (error: any) {
    console.error("Gagal login:", error.message || error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.delete("adminToken");
  console.log("Cookie deleted: adminToken"); // Debugging
  return response;
}

export async function GET() {
  return NextResponse.json(
    { error: "Metode tidak diizinkan" },
    { status: 405 }
  );
}
