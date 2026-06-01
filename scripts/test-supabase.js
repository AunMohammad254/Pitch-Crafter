import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Connection failed:', error.message)
  } else {
    console.log('Connection successful! Session:', data.session ? 'Active' : 'None')
  }
}

testConnection()
