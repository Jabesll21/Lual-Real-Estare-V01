import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

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
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError

      // Verificar que sea asesor
      const { data: session } = await supabase.auth.getSession()
      const { data: profile } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('id', session.session?.user.id)
        .single()

      if (!profile || !profile.active) {
        await supabase.auth.signOut()
        setError('No tienes acceso como asesor. Contacta al administrador.')
        return
      }

      navigate('/asesores/catalogo')
    } catch (err) {
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