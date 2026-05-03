import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function POST(request: Request) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Apenas administradores e CEOs veem explicações de risco
  if (session.user.role !== 'admin' && session.user.role !== 'ceo') {
    return NextResponse.json({ error: 'Acesso negado às métricas de risco.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const endpoint = `${backendUrl}/predict/explain`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Erro no proxy de explicação:', err);
    return NextResponse.json({ detail: 'Falha ao processar a explicação da IA' }, { status: 500 });
  }
}
