import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informasi Website */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Web GIS Rumah Sakit Surabaya</h3>
            <p className="text-sm text-white/80 mb-4">
              Aplikasi pencarian rumah sakit terdekat di Surabaya dengan layanan yang Anda butuhkan.
            </p>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="text-white hover:text-white/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tautan */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/80 hover:text-white">Beranda</Link></li>
              <li><Link href="/map" className="text-white/80 hover:text-white">Peta RS</Link></li>
              <li><Link href="/hospitals" className="text-white/80 hover:text-white">Daftar RS</Link></li>
              <li><Link href="/services" className="text-white/80 hover:text-white">Layanan RS</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Bantuan */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/80 hover:text-white">FAQ</Link></li>
              <li><Link href="/abput" className="text-white/80 hover:text-white">Kebijakan Privasi</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white">Syarat & Ketentuan</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white">Kontak Kami</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Jl. Raya Surabaya No. 123, Surabaya, Jawa Timur</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@webgisrs.com</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+62 31 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bawah */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>© {currentYear} Web GIS RS Surabaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
