import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las credenciales de Supabase en el archivo .env')
}

// Lock personalizado que nunca aborta
const noLock = async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
  return await fn()
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    storageKey: 'sb-jsadaigsymrbovdhiybq-auth-token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: noLock,
  },
})