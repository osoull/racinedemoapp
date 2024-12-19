import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://haovnjkyayiqenjpvlfb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhb3Zuamt5YXlpcWVuanB2bGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzOTI1MDksImV4cCI6MjA0Nzk2ODUwOX0.njUw2JN4A18PZgt6ijlvTgtT2bJ9gMXqQE6mKzJhM9A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});