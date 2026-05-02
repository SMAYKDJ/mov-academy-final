import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/finance/${slugPath}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao buscar dados financeiros' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/finance/${slugPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao salvar dados financeiros' }, { status: 500 });
  }
}
