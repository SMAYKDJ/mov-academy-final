const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewAccount() {
  const testEmail = 'ceo@moviment.com';
  
  console.log(`Tentando criar a conta ${testEmail}...`);
  const { error } = await supabase.auth.signUp({
    email: testEmail,
    password: '123456',
    options: {
      data: {
        nome: 'Smayk CEO',
        telefone: '91983457028',
        role: 'ceo'
      }
    }
  });

  if (error) {
    console.error('Erro na criacao:', error.message);
  } else {
    console.log('Conta criada. Testando login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: '123456',
    });
    
    if (loginError) {
      console.log('Bloqueado no login:', loginError.message);
    } else {
      console.log('SUCESSO! Logado:', loginData.user.email);
    }
  }
}
testNewAccount();
