require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('bookings').select('id, date, time, reminder_sent, status').order('created_at', { ascending: false }).limit(5);
  if (error) console.error("Error:", error);
  console.log(JSON.stringify(data, null, 2));
}
run();
