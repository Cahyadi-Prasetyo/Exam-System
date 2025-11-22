# Exam System (Sistem Ujian Sekolah Modern)

Platform ujian berbasis web yang dirancang untuk memudahkan sekolah dalam melaksanakan ujian secara online, aman, dan efisien. Dibangun dengan teknologi web modern untuk performa tinggi dan pengalaman pengguna yang optimal.

## 🚀 Fitur Utama

### 👨‍🎓 Untuk Siswa
*   **Antarmuka Ujian Fokus:** Desain fullscreen yang meminimalkan gangguan saat mengerjakan soal.
*   **Navigasi Soal Intuitif:** Mudah berpindah antar soal, menandai ragu-ragu, dan melihat status pengerjaan.
*   **Timer Real-time:** Penghitung waktu mundur yang akurat.
*   **Dashboard Informatif:** Melihat jadwal ujian, riwayat nilai, dan statistik performa.

### 👨‍🏫 Untuk Guru (Planned)
*   **Bank Soal Fleksibel:** Mendukung tipe soal Pilihan Ganda (PG) dan Esai.
*   **Manajemen Ujian:** Atur waktu mulai, durasi, dan pengacakan soal (randomize).
*   **Analisis Nilai:** Penilaian otomatis untuk PG dan rekapitulasi nilai instan.

### 🛡️ Keamanan & Admin
*   **Akses Terbatas:** Sistem tertutup di mana akun siswa dan guru dibuatkan oleh Admin (tidak ada pendaftaran publik).
*   **Anti-Cheat Dasar:** Deteksi perpindahan tab/jendela (bisa dikembangkan lebih lanjut).

## 🛠️ Teknologi yang Digunakan

*   **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
*   **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Ikon:** Lucide React / Heroicons

## 📂 Struktur Proyek

```bash
src/
├── app/
│   ├── (dashboard)/    # Halaman setelah login (Dashboard Siswa/Guru)
│   ├── exam/           # Halaman pengerjaan ujian (Fullscreen)
│   ├── globals.css     # Konfigurasi tema & Tailwind
│   ├── layout.tsx      # Layout utama aplikasi
│   └── page.tsx        # Halaman Login (Root)
├── components/         # Komponen UI reusable (Button, Card, Input)
└── lib/                # Utilitas & konfigurasi (Database, Helper functions)
```

## 💻 Cara Menjalankan (Local Development)

1.  **Clone repositori ini:**
    ```bash
    git clone https://github.com/username/exam-system.git
    cd exam-system
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan server development:**
    ```bash
    npm run dev
    ```

4.  Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Catatan Pengembang

*   **Autentikasi:** Saat ini menggunakan simulasi login. Integrasi database dan sesi (NextAuth/JWT) perlu ditambahkan.
*   **Database:** Disarankan menggunakan PostgreSQL atau MongoDB. Konfigurasi koneksi ada di `.env` (lihat `.env.example`).

---
Dibuat dengan ❤️ untuk kemajuan pendidikan.
