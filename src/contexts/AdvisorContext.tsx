import { createContext, useContext, useEffect, useState } from 'react'

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

const ADVISOR_KEY = 'lual-advisor-profile'

export function AdvisorProvider({ children }: { children: React.ReactNode }) {
  const [isAdvisor, setIsAdvisor] = useState(false)
  const [advisorProfile, setAdvisorProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Leer perfil del localStorage si existe
    try {
      const stored = localStorage.getItem(ADVISOR_KEY)
      if (stored) {
        const profile = JSON.parse(stored)
        setAdvisorProfile(profile)
        setIsAdvisor(true)
      }
    } catch {
      // ignorar
    }
  }, [])

  return (
    <AdvisorContext.Provider value={{ isAdvisor, advisorProfile, isLoading }}>
      {children}
    </AdvisorContext.Provider>
  )
}

export const useAdvisor = () => useContext(AdvisorContext)