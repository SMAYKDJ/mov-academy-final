import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, newPassword, adminId } = await request.json();

    if (!userId || !newPassword || !adminId) {
      return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Chave de serviço não configurada. Adicione SUPABASE_SERVICE_ROLE_KEY ao ambiente.' 
      }, { status: 500 });
    }

    // Cliente com privilégios de admin
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Verificar se quem está pedindo é realmente um CEO ou Admin
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    if (adminError || !['admin', 'ceo'].includes(adminUser?.role)) {
      return NextResponse.json({ error: 'Acesso negado. Apenas CEO ou Admin podem resetar senhas.' }, { status: 403 });
    }

    // 2. Atualizar a senha do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
