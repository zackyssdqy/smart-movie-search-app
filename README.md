# smart-movie-search-app

Smart Movie Search App adalah aplikasi pencarian film berbasis Vue 3 yang menggunakan OMDb API untuk mencari film, melihat detail film, dan menyimpan daftar favorit secara persisten. Proyek ini dibuat untuk keperluan technical test posisi Frontend Developer 

## Deskripsi Project

Fitur yang diimplementasikan pada aplikasi ini:

- Pencarian film dengan debouncing 500ms
- Infinite scroll untuk memuat hasil pencarian secara bertahap.
- Halaman detail film untuk menampilkan informasi lengkap seperti plot, actors, ratings, genre, runtime, dan metadata lain.
- Daftar favorit yang dapat ditambah atau dihapus dan disimpan ke `localStorage`.
- Empty state dan error state untuk kondisi hasil kosong, koneksi bermasalah, atau respons error dari API.
- Halaman discovery di halaman utama yang menampilkan koleksi film berdasarkan data OMDb dengan menerapkan filter untuk berdasarkan genre film.

## Cara Menjalankan

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan Environment Variable

Pastikan file `.env` berisi konfigurasi berikut:

```env
VITE_API_URL=https://www.omdbapi.com/
VITE_API_KEY=your_omdb_api_key
```

### 3. Jalankan Project

```bash
npm run dev
```


## Tech Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS
- LocalStorage
- OMDb API

## Architectural Decisions

- Saya memilih **Vue 3 + Vite** karena disamping perusahaan saat ini menggunakan vue sebagai tech stack, vue ringan, dan cepat untuk setup.
- Saya menggunakan **Vue Router** karena aplikasi memiliki lebih dari satu halaman, yaitu home, detail movie, dan favorites.
- Saya memakai **Pinia** untuk menyimpan state favorit karena state-nya sederhana, dipakai di beberapa halaman, dan perlu dipersist ke `localStorage` tanpa membuat logic state tersebar di banyak komponen.
- Saya memisahkan request ke **`src/services/api.js`** agar logic API tidak bercampur dengan UI component.
- Saya membuat **`useDebounce`** sebagai composable agar logic penundaan input bisa dipakai ulang dan tetap terpisah dari view.
- Saya memakai **IntersectionObserver** untuk infinite scroll supaya pemuatan data lebih efisien dibanding event scroll manual.

## Bonus / Improvements

- Menambahkan pencarian/filter tambahan seperti year, genre, atau rating.
- Menambahkan caching hasil pencarian agar request ke API lebih hemat.
- Memperbaiki pengalaman visual halaman discovery agar lebih informatif.
