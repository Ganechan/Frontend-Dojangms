// app\api\pelatih\absensi\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from '@/lib/serverFetch';
import { ApiError } from '@/lib/apiClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await serverFetch('/api/pelatih/absensi', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('Error submitting attendance:', err);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}