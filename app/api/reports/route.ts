import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
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
