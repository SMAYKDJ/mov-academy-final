const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function register() {
  console.log('Criando seu usuário no Supabase...');
  
  const { data, error } = await supabase.auth.signUp({
    email: 'smaykd@gmail.com',
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
    console.log('Pode fazer login com:');
    console.log('Email: smaykd@gmail.com');
    console.log('Senha: 123456');
  }
}

register();
