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

// Helper para fetch directo sin AbortError
export async function sbFetch(path: string, options: RequestInit = {}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok && response.status !== 204) {
    const error = await response.text()
    throw new Error(`Error ${response.status}: ${error}`)
  }

  if (response.status === 204) return null
  return response.json()
}