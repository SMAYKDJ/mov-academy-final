import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';

export async function POST(request: Request) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  try {
    const formData = await request.formData();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const endpoint = `${backendUrl}/upload/report`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || ''
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Erro no proxy de upload:', err);
    return NextResponse.json({ detail: 'Falha ao processar o upload do relatório' }, { status: 500 });
  }
}
