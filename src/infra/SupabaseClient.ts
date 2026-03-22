import { createClient } from '@supabase/supabase-js';

// Eğer Vite otomatik olarak EXPO_PUBLIC prefixini almıyorsa vite.config.ts dosyasına
// envPrefix: ['VITE_', 'EXPO_PUBLIC_'] eklenebilir.
const supabaseUrl = import.meta.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Anon Key is missing in environment variables.');
}

// Global Supabase Client nesnesi (Singleton benzeri)
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
