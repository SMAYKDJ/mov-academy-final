import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Administradores, CEOs e Recepção gerenciam o caixa
  const allowedRoles = ['admin', 'ceo', 'recepcao'];
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: 'Acesso negado ao caixa.' }, { status: 403 });
  }

  try {
    const { slug } = await params;
    const slugPath = slug.join('/');
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/cash/${slugPath}`, {
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
    return NextResponse.json({ detail: 'Erro no servidor de caixa' }, { status: 500 });
  }
}
