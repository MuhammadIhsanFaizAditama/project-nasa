# 🌌 Sistem Edukasi Astronomi

Aplikasi web edukasi astronomi berbasis **Laravel (Backend API)** + **React/Vite (Frontend)**, menampilkan artikel astronomi, APOD (Astronomy Picture of the Day) dari NASA, dan perpustakaan media NASA.

---

## 📁 Struktur Project

```
project-nasa-2/
├── backend/          → Laravel 11 (REST API)
└── frontend/         → React + Vite (SPA)
```

---

## ⚙️ Prerequisites

Pastikan sudah terinstall:

- PHP 8.3+
- Composer
- Node.js 18+ & NPM
- MySQL (Laragon / XAMPP)
- Git

---

## 🚀 Setup Backend (Laravel)

### 1. Masuk ke folder backend
```bash
cd backend
```

### 2. Install dependencies
```bash
composer install
```

### 3. Buat file .env
```bash
cp .env.example .env
```

### 4. Generate application key
```bash
php artisan key:generate
```

### 5. Konfigurasi database
Buat database baru bernama `project_nasa` di phpMyAdmin atau HeidiSQL, lalu edit file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_nasa
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Jalankan migration dan seeder

Untuk pertama kali atau ingin reset data:
```bash
php artisan migrate:fresh --seed
```

Atau jika hanya ingin migrate tanpa reset:
```bash
php artisan migrate --seed
```

### 7. Jalankan server Laravel
```bash
php artisan serve
```

✅ Backend berjalan di `http://localhost:8000`

---

## 🎨 Setup Frontend (React)

### 1. Masuk ke folder frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat file .env
Buat file `.env` baru di dalam folder `frontend`:
```env
VITE_NASA_KEY=your_nasa_api_key_here
```

> 🔑 Dapatkan NASA API key gratis di [https://api.nasa.gov](https://api.nasa.gov)
> Tanpa API key, aplikasi tetap berjalan menggunakan `DEMO_KEY` (limit 30 request/jam)

### 4. Jalankan development server
```bash
npm run dev
```

✅ Frontend berjalan di `http://localhost:5173`

---

## ▶️ Menjalankan Aplikasi

Buka **2 terminal** secara bersamaan:

**Terminal 1 — Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Buka browser dan akses: **http://localhost:5173**

---

## 🔐 Login Admin

| Field    | Value          |
|----------|----------------|
| Email    | admin@nasa.com |
| Password | nasa123        |

---

## 📡 API Endpoints

Base URL: `http://localhost:8000/api`

| Method | Endpoint       | Auth | Deskripsi       |
|--------|----------------|------|-----------------|
| POST   | /login         | ❌   | Login admin     |
| POST   | /logout        | ✅   | Logout admin    |
| GET    | /artikel       | ❌   | Daftar artikel  |
| GET    | /artikel/{id}  | ❌   | Detail artikel  |
| POST   | /artikel       | ✅   | Tambah artikel  |
| PUT    | /artikel/{id}  | ✅   | Update artikel  |
| DELETE | /artikel/{id}  | ✅   | Hapus artikel   |
| GET    | /kategori      | ❌   | Daftar kategori |
| POST   | /kategori      | ✅   | Tambah kategori |
| PUT    | /kategori/{id} | ✅   | Update kategori |
| DELETE | /kategori/{id} | ✅   | Hapus kategori  |

> ✅ = Memerlukan Bearer Token (Login terlebih dahulu)

---

## 🌐 Halaman Aplikasi

| Path              | Deskripsi                       |
|-------------------|---------------------------------|
| `/`               | Landing page (splash screen)    |
| `/home`           | Beranda — APOD + daftar artikel |
| `/artikel`        | Daftar semua artikel            |
| `/artikel/:id`    | Detail artikel                  |
| `/apod`           | Astronomy Picture of the Day    |
| `/nasa-library`   | Perpustakaan media NASA         |
| `/login`          | Login admin                     |
| `/admin`          | Dashboard admin                 |
| `/admin/artikel`  | Kelola artikel (CRUD)           |
| `/admin/kategori` | Kelola kategori (CRUD)          |
| `/admin/apod`     | Preview & konfigurasi APOD      |

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 11
- Laravel Sanctum (API Authentication)
- MySQL

**Frontend:**
- React 18 + Vite
- React Router DOM
- Axios
- Bootstrap 5

**External API:**
- NASA APOD API
- NASA Image & Video Library API

---

## 👥 Tim Pengembang

- Wahyudi
- Icha Febrianti
- Riska
- Muh. Ihsan Faiz Aditama
- Fabyan Aktrinaldi

---

## 📄 Lisensi

Project ini dibuat untuk keperluan edukasi.
