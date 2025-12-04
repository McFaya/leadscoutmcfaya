import { createClient } from '@supabase/supabase-js';

// Configuration with provided credentials
const supabaseUrl = 'https://xjfzhfhrempdfbhjwpnp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZnpoZmhyZW1wZGZiaGp3cG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDU5NzksImV4cCI6MjA4MDQyMTk3OX0.-gJHBXcyHIdexOJ8LMSjsBy7O9fhNxeq2zyW3YjXMtg';

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing. App will crash.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);