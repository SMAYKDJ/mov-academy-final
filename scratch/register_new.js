const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function registerNewEmail() {
  console.log('Registrando smayk.live@gmail.com...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'smayk.live@gmail.com',
    password: '123456',
    options: {
      data: {
        nome: 'Smayk',
        telefone: '91983457028',
        role: 'admin'
      }
    }
  });

  if (error) {
    console.error('Erro ao cadastrar:', error.message);
  } else {
    console.log('Usuário criado com sucesso!');
    console.log('Tentando login imediato para validar...');
    
    // Testa o login para ver se o email precisa ser confirmado
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: 'smayk.live@gmail.com',
      password: '123456',
    });
    
    if (loginError) {
      console.log('Bloqueio no login:', loginError.message);
    } else {
      console.log('NENHUM BLOQUEIO! Login efetuado com sucesso!');
    }
  }
}

registerNewEmail();
