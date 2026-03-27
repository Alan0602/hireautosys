import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const hash = bcrypt.hashSync('admin123', 10);
  const { data, error } = await supabase.from('users').update({ password_hash: hash }).eq('username', 'Jenin').select();
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log('Updated Jenin password to admin123!');
}
run();
