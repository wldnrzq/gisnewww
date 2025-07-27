"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Pastikan lucide-react terinstal

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/image/logo.png"
              alt="Logo"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <NavLinks />
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col space-y-2">
            <NavLinks onClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

// Komponen NavLinks agar bisa digunakan ulang
function NavLinks({ onClick }: { onClick?: () => void }) {
  const linkClass =
    "block md:inline px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:border-b-2 hover:border-primary transition-colors";

  return (
    <>
      <Link href="/" onClick={onClick} className={linkClass}>
        Beranda
      </Link>
      <Link href="/map" onClick={onClick} className={linkClass}>
        Peta RS
      </Link>
      <Link href="/hospitals" onClick={onClick} className={linkClass}>
        Daftar RS
      </Link>
      <Link href="/services" onClick={onClick} className={linkClass}>
        Layanan RS
      </Link>
      <Link href="/about" onClick={onClick} className={linkClass}>
        Tentang Kami
      </Link>
    </>
  );
}
