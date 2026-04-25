const { createClient } = require('@supabase/supabase-js');

const url = 'https://qwxfunbgykcnupalnatu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eGZ1bmJneWtjbnVwYWxuYXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDc5OTksImV4cCI6MjA5MjQ4Mzk5OX0.Dx4xgSd62BgB5c0XSxBJPLoOTlB2Ky4snLNDa1W2g0Y';

const supabase = createClient(url, key);

async function test() {
  console.log('Testing login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'smayklive@gmail.com',
    password: '123456'
  });
  
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS:', data.user.email);
  }
}
test();
