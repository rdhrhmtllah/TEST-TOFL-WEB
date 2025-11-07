Aplikasi Latihan TOEFL Vue.js 3

Ini adalah aplikasi latihan TOEFL lengkap yang dibangun dengan Vue.js 3, Vite, dan Tailwind CSS, serta didukung oleh Gemini API.

Fitur

Buat soal tes kustom (Reading, Listening, Structure) menggunakan AI.

Impor/Ekspor soal tes dalam format JSON.

Timer dan skor otomatis.

Fitur audio player (TTS) untuk soal Listening.

Dapatkan penjelasan mendalam untuk setiap soal dari AI.

Analisa kelemahan Anda di akhir tes, lengkap dengan saran.

Chat interaktif dengan AI untuk membahas hasil analisa Anda.

Download riwayat chat analisa sebagai PDF.

Persiapan Proyek

Clone repositori:

git clone <url-repo>
cd vue-toefl-app

Install dependensi:

npm install

Buat File Environment (.env):

Salin file .env.example menjadi file baru bernama .env (atau .env.local).

Buka file .env yang baru Anda buat.

Masukkan Gemini API Key Anda setelah tanda =.

VITE_GEMINI_API_KEY=AIzaSy...ANDA...

Menjalankan Aplikasi

Mode Development (Pengembangan)

npm run dev

Aplikasi akan berjalan di http://localhost:8080.

Mode Production (Produksi)

Build aplikasi:

npm run build

Preview build:

npm run preview

Menjalankan dengan Docker

Pastikan Anda memiliki Docker yang terinstal.

Build Docker Image:

PENTING: Anda harus memasukkan API key Anda saat proses build.

docker build --build-arg "VITE_GEMINI_API_KEY=AIzaSy...ANDA..." -t toefl-app .

Run Docker Container:

docker run -d -p 80:80 --name toefl-app-container toefl-app

Aplikasi sekarang akan dapat diakses di http://localhost.
