This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

<!-- Test 2 -->

# Coding Convention — Next.js Project

Ikuti aturan berikut saat membantu menulis atau memodifikasi kode di proyek ini.

---

## Stack & Framework

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: @tabler/icons-react

---

## Struktur Fetch Data

### Aturan utama

- **Fetch data di Server Component** (`page.tsx`) bukan di Client Component
- Gunakan `async/await` di `page.tsx` dan buat fungsi terpisah untuk fetch
- Gunakan `Promise.all` untuk fetch paralel
- Selalu tambahkan `next: { revalidate: 60 }` pada setiap fetch
- Gunakan `process.env.BASE_URL` (bukan `NEXT_PUBLIC_BASE_URL`) untuk URL server
- Tangani error dengan `.catch(() => null)` per response

### Contoh pola fetch

```tsx
const BASE_URL = process.env.BASE_URL;

async function getDashboardData() {
  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/api/...`, { next: { revalidate: 60 } }),
      fetch(`${BASE_URL}/api/...`, { next: { revalidate: 60 } }),
    ]);

    const [data1, data2] = await Promise.all([
      res1.json().catch(() => null),
      res2.json().catch(() => null),
    ]);

    return { data1, data2 };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Page() {
  const data = await getDashboardData();
  return <Component data={data} />;
}
```

---

## Komponen

### Server Component

- Tidak ada `"use client"`
- Tidak ada `useState`, `useEffect`
- Terima data lewat props, proses langsung tanpa state
- Gunakan `?? null` sebagai fallback nilai

### Client Component

- Tambahkan `"use client"` hanya jika komponen butuh interaktivitas (onClick, input, dll)
- Hindari fetch data di Client Component kecuali untuk data real-time atau hasil interaksi user

### Tipe Props

- Gunakan `type` bukan `interface`
- Gunakan `any` hanya jika struktur response API belum pasti
- Selalu buat type terpisah untuk props, jangan inline

```tsx
type DashboardData = {
  userJson: any;
  beltJson: any;
} | null;

export function Component({ data }: { data: DashboardData }) { ... }
```

---

## Penamaan

- Komponen: `PascalCase` → `SectionCards`, `ChartAreaInteractive`
- Fungsi fetch: `get` + nama data → `getDashboardData`, `getUserStats`
- Variabel data dari props: langsung deskriptif → `totalAnggota`, `kejuaraanSelesai`
- File komponen: `kebab-case` → `section-cards.tsx`, `chart-area-interactive.tsx`
- Bahasa variabel & label UI: **Bahasa Indonesia**

---

## Struktur Folder

```
app/
└── admin/
    ├── page.tsx         ← fetch data di sini
    ├── loading.tsx      ← skeleton loading
    └── data.json        ← data statis jika ada

components/
└── admin/
    ├── section-cards.tsx
    ├── chart-area-interactive.tsx
    └── ...
```

---

## Styling

- Gunakan Tailwind utility class, tidak ada CSS custom kecuali terpaksa
- Gunakan `border-l-4 border-l-{color}-500` untuk aksen kartu
- Gunakan `bg-{color}-500/10` untuk background icon
- Gunakan `text-muted-foreground` untuk teks sekunder
- Responsive dengan class `@xl/main:`, `@5xl/main:`, `lg:` sesuai konteks

---

## Lain-lain

- Selalu tambahkan `console.error` di blok catch
- Gunakan `toLocaleString()` untuk format angka
- Gunakan `toLocaleDateString("id-ID", {...})` untuk format tanggal
- Tampilkan `"—"` jika data null, bukan string kosong atau 0
- Gunakan `.at(-1)` untuk ambil elemen terakhir array


data user
{
  "name": "admin",
  "email": "admin@gmail.com",
  "password": "admin",
  "phone": "1234567890",
  "tanggal_lahir": "2012-08-12",
  "roles" : ["admin"],
  "belt_id": 9
}

{
  "name": "admin",
  "email": "admin2@gmail.com",
  "password": "admin",
  "phone": "1234567890",
  "tanggal_lahir": "2012-08-12",
  "roles" : ["admin", "pelatih"],
  "belt_id": 9
}

{
  "name": "admin",
  "email": "admin3@gmail.com",
  "password": "admin",
  "phone": "1234567890",
  "tanggal_lahir": "2012-08-12",
  "roles" : ["admin", "pelatih", "murid"],
  "belt_id": 9
}

{
  "name": "pelatih",
  "email": "pelatih@gmail.com",
  "password": "pelatih",
  "phone": "1234567890",
  "tanggal_lahir": "2012-08-12",
  "roles" : ["pelatih", "murid"],
  "belt_id": 9
}

{
  "name": "murid",
  "email": "murid@gmail.com",
  "password": "murid",
  "phone": "1234567890",
  "tanggal_lahir": "2012-08-12",
  "roles" : ["murid"],
  "belt_id": 9
}