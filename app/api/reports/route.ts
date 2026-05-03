import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const session = await verifySession(request);
  if ('error' in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  // Apenas administradores e CEOs listam relatórios
  if (session.user.role !== 'admin' && session.user.role !== 'ceo') {
    return NextResponse.json({ error: 'Acesso negado aos relatórios.' }, { status: 403 });
  }

  const reportsDir = path.resolve(process.cwd(), 'RELATORIOS');
  try {
    const files = await fs.readdir(reportsDir);
    const pdfFiles = files.filter((f) => f.toLowerCase().endsWith('.pdf'));
    return NextResponse.json({ files: pdfFiles });
  } catch (err) {
    console.error('Erro ao listar relatórios:', err);
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}
