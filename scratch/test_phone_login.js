const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fbbcnazqmkgdrxbdeysr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmNuYXpxbWtnZHJ4YmRleXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTA2MDgsImV4cCI6MjA4ODEyNjYwOH0.vY_Bv54an-St6xfggnVh3pP33TfQNij1tIBb95fng1I';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPhoneLogin() {
  const loginId = '91983457028';
  let finalEmail = loginId.trim();

  try {
    const phoneDigits = loginId.replace(/\D/g, '');
    console.log('Phone digits:', phoneDigits);

    const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, telefone')
          .like('telefone', `%${phoneDigits}%`)
          .maybeSingle();

    console.log('Profile lookup result:', profileData);
    if (profileError) {
      console.log('Profile error:', profileError);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
testPhoneLogin();
