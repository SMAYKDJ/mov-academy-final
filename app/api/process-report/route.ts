import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function POST(request: Request) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Apenas administradores e CEOs processam relatórios
  if (session.user.role !== 'admin' && session.user.role !== 'ceo') {
    return NextResponse.json({ error: 'Acesso negado ao processamento.' }, { status: 403 });
  }

  const { filename } = await request.json();
  if (!filename) {
    return NextResponse.json({ detail: 'O nome do arquivo é obrigatório' }, { status: 400 });
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const endpoint = `${backendUrl}/process/report`;
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || ''
      },
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
    return NextResponse.json({ detail: 'Falha ao processar o relatório' }, { status: 500 });
  }
}
