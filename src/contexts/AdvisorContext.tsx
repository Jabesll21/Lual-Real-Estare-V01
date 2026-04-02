import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AdvisorContextType {
  isAdvisor: boolean
  advisorProfile: any | null
  isLoading: boolean
}

const AdvisorContext = createContext<AdvisorContextType>({
  isAdvisor: false,
  advisorProfile: null,
  isLoading: false,
})

export function AdvisorProvider({ children }: { children: React.ReactNode }) {
  const [isAdvisor, setIsAdvisor] = useState(false)
  const [advisorProfile, setAdvisorProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      if (!session?.user) {
        if (mounted) {
          setIsAdvisor(false)
          setAdvisorProfile(null)
        }
        return
      }

      try {
        const { data } = await supabase
          .from('advisor_profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()

        if (!mounted) return

        if (data?.active) {
          setIsAdvisor(true)
          setAdvisorProfile(data)
        } else {
          setIsAdvisor(false)
          setAdvisorProfile(null)
        }
      } catch {
        if (mounted) {
          setIsAdvisor(false)
          setAdvisorProfile(null)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AdvisorContext.Provider value={{ isAdvisor, advisorProfile, isLoading }}>
      {children}
    </AdvisorContext.Provider>
  )
}

export const useAdvisor = () => useContext(AdvisorContext)