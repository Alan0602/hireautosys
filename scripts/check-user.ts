import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('users').select('*').eq('role', 'admin').limit(1);
  if (error) {
    console.error(error);
    process.exit(1);
  }
  if (data && data.length > 0) {
    const user = data[0];
    console.log(`FOUND ADMIN: ${user.username}`);
    const hash = user.password_hash || user.password;
    if (hash) {
      console.log(`Password 'ababab' matches: ${bcrypt.compareSync('ababab', hash)}`);
      console.log(`Password 'yourpassword' matches: ${bcrypt.compareSync('yourpassword', hash)}`);
      console.log(`Password 'admin123' matches: ${bcrypt.compareSync('admin123', hash)}`);
    } else {
      console.log('No password hash found on user object:', Object.keys(user));
    }
  } else {
    console.log('No admin users found in DB!');
  }
}
run();
