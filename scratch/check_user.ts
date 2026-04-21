
import { createClient } from '@supabase/supabase-js';

async function check() {
  const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('Checking user presence...');
  
  const email = 'smaykd@gmail.com';
  const { data: profile } = await supabase
       .from('profiles')
       .select('*')
       .eq('email', email)
       .maybeSingle();

  if (profile) {
    console.log('USER_ALREADY_EXISTS');
  } else {
    console.log('USER_NOT_FOUND');
  }
}

check();
