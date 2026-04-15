import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export default function AdvisorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
  if (!email || !password) {
    setError('Por favor completa todos los campos')
    return
  }

  setIsLoading(true)
  setError('')

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // Login
    const loginRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!loginRes.ok) throw new Error('Credenciales incorrectas')
    const session = await loginRes.json()

    // Verificar que sea asesor
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/advisor_profiles?select=*&id=eq.${session.user.id}`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${session.access_token}`,
        },
      }
    )

    const profiles = await profileRes.json()
    const profile = profiles?.[0]

    if (!profile || !profile.active) {
      setError('No tienes acceso como asesor. Contacta al administrador.')
      return
    }

    // Guardar sesión y perfil
    localStorage.setItem('sb-jsadaigsymrbovdhiybq-auth-token', JSON.stringify(session))
    localStorage.setItem('lual-advisor-profile', JSON.stringify(profile))

    navigate('/asesores/catalogo')
  } catch (err: any) {
    setError('Credenciales incorrectas. Verifica tu email y contraseña.')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/images/LOGO LUAL-01.png" alt="LUAL" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Portal de Asesores</h1>
          <p className="text-muted-foreground mt-1">Acceso exclusivo para asesores autorizados</p>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asesor@email.com"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full h-12">
              {isLoading ? 'Verificando...' : 'Ingresar al portal'}
            </Button>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          ¿No tienes acceso? Contacta al administrador de LUAL Real Estate
        </p>
      </motion.div>
    </div>
  )
}