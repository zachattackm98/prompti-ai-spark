
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getUserFromAuth(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No authorization header');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export { supabase };
