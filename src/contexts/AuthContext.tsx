import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {},
})

const INACTIVITY_TIMEOUT = 60 * 60 * 1000
const AUTH_KEY = 'sb-jsadaigsymrbovdhiybq-auth-token'

function getSessionFromStorage() {
  try {
    const data = localStorage.getItem(AUTH_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)
    if (!parsed?.access_token) return null
    // Verificar que no haya expirado
    if (parsed.expires_at && parsed.expires_at < Date.now() / 1000) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getSessionFromStorage())
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logout = useCallback(() => {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem('lual-auth')
  setIsAuthenticated(false)
  setTimeout(() => {
    window.location.href = '/#/admin'
  }, 100)
}, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(logout, INACTIVITY_TIMEOUT)
  }, [logout])

  useEffect(() => {
    if (!isAuthenticated) return
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isAuthenticated, resetTimer])

  // Escuchar cambios en localStorage (cuando hace login)
  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!getSessionFromStorage())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)