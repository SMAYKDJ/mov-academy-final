import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Pass the authorization header to the backend
    const response = await fetch(`${backendUrl}/finance/${slugPath}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao buscar dados financeiros' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/finance/${slugPath}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao salvar dados financeiros' }, { status: 500 });
  }
}
