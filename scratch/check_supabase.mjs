
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const index = line.indexOf('=');
  if (index > -1) {
    const key = line.substring(0, index).trim();
    const value = line.substring(index + 1).trim();
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('--- VERIFICAÇÃO SUPABASE ---');
  console.log('URL:', supabaseUrl);
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('telefone').limit(1);
    
    if (pError) {
      if (pError.message.includes('column "telefone" does not exist')) {
        console.log('❌ Tabela [profiles] existe, MAS a coluna [telefone] está faltando.');
      } else if (pError.message.includes('does not exist')) {
        console.log('❌ Tabela [profiles] não existe.');
      } else {
        console.log(`❌ Erro na tabela [profiles]: ${pError.message}`);
      }
    } else {
      console.log('✅ Tabela [profiles] OK (coluna telefone presente)');
    }
    
    const tables = ['alunos', 'transacoes', 'treinos'];
    for (const t of tables) {
      const { error } = await supabase.from(t).select('*').limit(1);
      if (error) console.log(`❌ Tabela [${t}] ERRO: ${error.message}`);
      else console.log(`✅ Tabela [${t}] OK`);
    }
    console.log('----------------------------');
  } catch (e) {
    console.error('❌ Falha na verificação:', e.message);
    process.exit(1);
  }
}

check();
