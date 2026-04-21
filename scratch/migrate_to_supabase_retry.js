const { createClient } = require('@supabase/supabase-js');

async function migrate() {
  const url = 'https://hnrrwynukzerysxgsvvl.supabase.co';
  const key = 'sb_publishable_34134WYds3wEeErr_xpE-Q_SocH4GWS'; 

  const supabase = createClient(url, key);

  const mockAlunos = [
    { nome: 'Daniela Costa', email: 'daniela.costa@email.com', plano: 'Black VIP', status: 'em_dia', frequencia: 4, risco: 15, ultimo_pagamento: '13/04/2026' },
  ];

  console.log('Tentando migracao com a chave que funcionou no teste...');
  const { data, error } = await supabase.from('alunos').upsert(mockAlunos, { onConflict: 'email' });
  
  if (error) {
    console.error('Erro:', error.message);
  } else {
    console.log('Sucesso!');
  }
}

migrate();
