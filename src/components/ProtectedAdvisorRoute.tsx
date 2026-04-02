import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function ProtectedAdvisorRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading')

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setStatus('unauthorized'); return }

      const { data } = await supabase
        .from('advisor_profiles')
        .select('id, active')
        .eq('id', session.user.id)
        .single()

      setStatus(data?.active ? 'authorized' : 'unauthorized')
    }
    check()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthorized') return <Navigate to="/asesores" replace />
  return <>{children}</>
}