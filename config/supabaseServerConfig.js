// config/supabaseServerClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key only on the server

const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabaseServer;