import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasSession = () => {
    try {
      // Verificar todas las keys posibles donde Supabase guarda la sesión
      const keysToCheck = [
        'lual-auth',
        'sb-jsadaigsymrbovdhiybq-auth-token',
      ]
      
      for (const key of keysToCheck) {
        const item = localStorage.getItem(key)
        if (item) {
          const parsed = JSON.parse(item)
          if (parsed?.access_token) return true
        }
      }

      // También buscar cualquier key que tenga access_token
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key) continue
        try {
          const item = localStorage.getItem(key)
          if (item?.includes('access_token')) return true
        } catch { continue }
      }

      return false
    } catch {
      return false
    }
  }

  if (!hasSession()) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}