import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'

export default function AdminForms() {
  const [forms, setForms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed'>('all')

  useEffect(() => {
    loadForms()
  }, [])

  async function loadForms() {
    setIsLoading(true)
    const { data } = await supabase
      .from('diagnosis_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setForms(data || [])
    setIsLoading(false)
  }

  const markAsReviewed = async (id: string) => {
    await supabase
      .from('diagnosis_submissions')
      .update({ status: 'reviewed' })
      .eq('id', id)
    loadForms()
  }

  const filtered = forms.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.whatsapp.includes(searchQuery)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'new' && f.status === 'new') ||
      (filter === 'reviewed' && f.status === 'reviewed')
    return matchesSearch && matchesFilter
  })

  const cityLabels: Record<string, string> = {
    tijuana: 'Tijuana',
    cdmx: 'Ciudad de México',
    both: 'Ambas ciudades',
  }

  const capitalLabels: Record<string, string> = {
    yes: 'Sí tiene capital',
    no: 'No tiene capital',
    'not-sure': 'No está seguro',
  }

  const rangeLabels: Record<string, string> = {
    '500k-1m': '$500k - $1M',
    '1m-2m': '$1M - $2M',
    '2m-3m': '$2M - $3M',
    '3m-5m': '$3M - $5M',
    '5m+': 'Más de $5M',
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Formularios</h1>
          <p className="text-muted-foreground mt-1">
            Diagnósticos recibidos de posibles inversionistas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'new', 'reviewed'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Todos' : f === 'new' ? 'Nuevos' : 'Revisados'}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No hay formularios que mostrar</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((form) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{form.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          form.status === 'new'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {form.status === 'new'
                            ? <><Clock className="w-3 h-3" /> Nuevo</>
                            : <><CheckCircle className="w-3 h-3" /> Revisado</>
                          }
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
                          <p className="text-sm font-medium">{form.whatsapp}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Capital</p>
                          <p className="text-sm font-medium">
                            {capitalLabels[form.has_capital] || form.has_capital}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Inversión</p>
                          <p className="text-sm font-medium">
                            {rangeLabels[form.investment_range] || form.investment_range}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Ciudad</p>
                          <p className="text-sm font-medium">
                            {cityLabels[form.city_interest] || form.city_interest}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Recibido el {new Date(form.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://wa.me/${form.whatsapp}`, '_blank')}
                        className="whitespace-nowrap"
                      >
                        WhatsApp
                      </Button>
                      {form.status === 'new' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsReviewed(form.id)}
                          className="whitespace-nowrap text-xs"
                        >
                          Marcar revisado
                        </Button>
                      )}
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