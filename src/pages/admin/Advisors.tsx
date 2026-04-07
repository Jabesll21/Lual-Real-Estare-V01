import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Search, UserCheck, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'
import { Button } from '@/components/ui/button'

export default function AdminAdvisors() {
  const [advisors, setAdvisors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAdvisors()
  }, [])

  async function loadAdvisors() {
  setIsLoading(true)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  const response = await fetch(
    `${supabaseUrl}/rest/v1/advisor_profiles?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${token}`,
      },
    }
  )
  const data = await response.json()
  setAdvisors(Array.isArray(data) ? data : [])
  setIsLoading(false)
}

 const handleToggleActive = async (advisor: any) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  await fetch(`${supabaseUrl}/rest/v1/advisor_profiles?id=eq.${advisor.id}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ active: !advisor.active }),
  })

  setAdvisors(prev =>
    prev.map(a => a.id === advisor.id ? { ...a, active: !a.active } : a)
  )
}

const handleDelete = async (id: string) => {
  if (!confirm('¿Eliminar este asesor? Perderá acceso al portal inmediatamente.')) return

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  await fetch(`${supabaseUrl}/rest/v1/advisor_profiles?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=minimal',
    },
  })

  setAdvisors(prev => prev.filter(a => a.id !== id))
}

  const filtered = advisors.filter(a =>
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Asesores</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el acceso de asesores externos al portal
            </p>
          </div>
          
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar asesor..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No hay asesores registrados</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((advisor) => (
              <motion.div key={advisor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className={`p-4 ${!advisor.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                          {advisor.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{advisor.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            advisor.active
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {advisor.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{advisor.email}</p>
                        {advisor.phone && (
                          <p className="text-xs text-muted-foreground">{advisor.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(advisor)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title={advisor.active ? 'Desactivar acceso' : 'Activar acceso'}
                      >
                        {advisor.active
                          ? <ToggleRight className="w-5 h-5 text-primary" />
                          : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                        }
                      </button>
                      <button
                        onClick={() => handleDelete(advisor.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                        title="Eliminar asesor"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}