import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "C7A7D98E9F6FEE43FB4AC51AE43FC"
);

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;
  console.log("Middleware: Token found:", token); // Debugging

  if (!token) {
    console.log("Middleware: No token, redirecting to /admin/login");
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("Middleware: Token valid, payload:", payload); // Debugging
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware: Invalid token:", error);
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
