import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { filename } = await request.json();
  if (!filename) {
    return NextResponse.json({ detail: 'Filename is required' }, { status: 400 });
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const endpoint = `${backendUrl}/process/report`;
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
    if (!resp.ok) {
      const err = await resp.json();
      return NextResponse.json(err, { status: resp.status });
    }
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao processar relatório:', err);
    return NextResponse.json({ detail: 'Failed to process report' }, { status: 500 });
  }
}
