import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  try {
    const slug = (await params).slug.join('/');
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/inventory/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro no servidor de estoque' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  try {
    const slug = (await params).slug.join('/');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/inventory/${slug}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao buscar dados de estoque' }, { status: 500 });
  }
}
