const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Use confirmed keys
const url = 'https://hnrrwynukzerysxgsvvl.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnJ3eW51a3plcnlzeGdzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTYwMzEsImV4cCI6MjAyNjg3MjAzMX0.X_YV6zF9wQwWQ_SocH4GWS'; 

const supabase = createClient(url, key);

const mockAlunos = [
  { nome: 'Daniela Costa', email: 'daniela.costa@email.com', plano: 'Black VIP', status: 'em_dia', frequencia: 4, risco: 15, ultimo_pagamento: '13/04/2026' },
  { nome: 'Helena Martins', email: 'helena.m@email.com', plano: 'Platinum', status: 'em_dia', frequencia: 3, risco: 22, ultimo_pagamento: '12/04/2026' },
  { nome: 'Igor Ferreira', email: 'igor.f@email.com', plano: 'Basic Fit', status: 'pendente', frequencia: 1, risco: 75, ultimo_pagamento: '15/03/2026' },
];

async function migrate() {
  console.log('Migrando alunos para Supabase...');
  const { data, error } = await supabase.from('alunos').upsert(mockAlunos, { onConflict: 'email' });
  
  if (error) {
    console.error('Erro na migracao:', error.message);
  } else {
    console.log('Migracao concluida com sucesso!');
  }
}

migrate();
