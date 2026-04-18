const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'smaykd@gmail.com',
    password: '123456',
  });

  if (error) {
    console.error('Erro de login detalhado:', error.message);
  } else {
    console.log('Login funcionou na API:', data.user.id);
  }
}
login();
