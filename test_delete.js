import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vfszcplgxrhmysepwnzo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmc3pjcGxneHJobXlzZXB3bnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDI0OTQsImV4cCI6MjEwMzU3ODQ5NH0.6f1xXpVSP-A2-LeTMTU7jgKeWDxusr5K9UxKd_gv5Mo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDelete() {
  const { data, error } = await supabase.from('students').delete().eq('id', 'STU002').select();
  console.log('Result:', data);
  if (error) {
    console.error('Error:', error);
  }
}

testDelete();
