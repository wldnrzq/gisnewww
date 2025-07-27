export interface Hospital {
  kode_rs: string;
  nama: string;
  deskripsi: string;
  lokasi: {
    alamat: string;
    wilayah: string;
  };
  kontak: {
    telepon: string;
    fax: string;
    email: string;
  };
  layanan: string[];
  koordinat: {
    lat: number;
    lng: number;
  };
}
