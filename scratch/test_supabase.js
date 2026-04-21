const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  const url = 'https://hnrrwynukzerysxgsvvl.supabase.co';
  const key = 'sb_publishable_34134WYds3wEeErr_xpE-Q_SocH4GWS'; 

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('alunos').select('count', { count: 'exact' });

  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connected successfully! Count:', data);
  }
}

testConnection();
