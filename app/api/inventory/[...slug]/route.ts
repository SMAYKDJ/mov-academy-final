import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Administradores, CEOs e Recepção gerenciam o estoque
  const allowedRoles = ['admin', 'ceo', 'recepcao'];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado ao estoque.' }, { status: 403 });
  }

  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/inventory/${slugPath}`, {
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
    return NextResponse.json({ detail: 'Erro no servidor de estoque' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Apenas administradores e CEOs gerenciam o estoque
  if (session.user.role !== 'admin' && session.user.role !== 'ceo') {
    return NextResponse.json({ error: 'Acesso negado ao estoque.' }, { status: 403 });
  }

  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/inventory/${slugPath}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      }
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ detail: 'Erro ao buscar dados de estoque' }, { status: 500 });
  }
}
