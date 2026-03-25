import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, ClipboardList, Users, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalDiagnosis: 0,
    newDiagnosis: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentForms, setRecentForms] = useState<any[]>([])

  useEffect(() => {
    async function loadStats() {
      const [propertiesRes, diagnosisRes, recentRes] = await Promise.all([
        supabase.from('properties').select('id, active'),
        supabase.from('diagnosis_submissions').select('id, status, created_at'),
        supabase
          .from('diagnosis_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const properties = propertiesRes.data || []
      const diagnosis = diagnosisRes.data || []

      setStats({
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.active).length,
        totalDiagnosis: diagnosis.length,
        newDiagnosis: diagnosis.filter(d => d.status === 'new').length,
      })

      setRecentForms(recentRes.data || [])
      setIsLoading(false)
    }

    loadStats()
  }, [])

  const statCards = [
    {
      label: 'Propiedades activas',
      value: stats.activeProperties,
      total: stats.totalProperties,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Diagnósticos recibidos',
      value: stats.totalDiagnosis,
      total: null,
      icon: ClipboardList,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Nuevos sin revisar',
      value: stats.newDiagnosis,
      total: null,
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general de LUAL Real Estate
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  {stat.total !== null && (
                    <div className="text-xs text-muted-foreground mt-1">
                      de {stat.total} en total
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Formularios recientes */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnósticos recientes</h2>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : recentForms.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay formularios recibidos aún
            </p>
          ) : (
            <div className="space-y-3">
              {recentForms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{form.name}</p>
                    <p className="text-sm text-muted-foreground">{form.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      form.status === 'new'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {form.status === 'new' ? 'Nuevo' : 'Revisado'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(form.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}