import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Clock, Building2, ClipboardList } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FormType = 'diagnosis' | 'property_interest'

export default function AdminForms() {
  const [diagnosisForms, setDiagnosisForms] = useState<any[]>([])
  const [interestForms, setInterestForms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | FormType>('all')
  const [cityTab, setCityTab] = useState<'all' | 'Tijuana' | 'CDMX'>('all')

  useEffect(() => {
    loadForms()
  }, [])

  async function loadForms() {
    setIsLoading(true)
    const [diagnosisRes, interestRes] = await Promise.all([
      supabase
        .from('diagnosis_submissions')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('property_interests')
        .select('*')
        .order('created_at', { ascending: false }),
    ])
    setDiagnosisForms(diagnosisRes.data || [])
    setInterestForms(interestRes.data || [])
    setIsLoading(false)
  }

  const markAsReviewed = async (id: string, type: FormType) => {
    const table = type === 'diagnosis' ? 'diagnosis_submissions' : 'property_interests'
    const { error } = await supabase
      .from(table)
      .update({ status: 'reviewed' })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar: ' + error.message)
      return
    }

    if (type === 'diagnosis') {
      setDiagnosisForms(prev =>
        prev.map(f => f.id === id ? { ...f, status: 'reviewed' } : f)
      )
    } else {
      setInterestForms(prev =>
        prev.map(f => f.id === id ? { ...f, status: 'reviewed' } : f)
      )
    }
  }

  // Combinar y etiquetar todos los formularios
  const allForms = [
    ...diagnosisForms.map(f => ({ ...f, formType: 'diagnosis' as FormType })),
    ...interestForms.map(f => ({ ...f, formType: 'property_interest' as FormType })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const filtered = allForms.filter(f => {
    const matchesSearch =
      f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.whatsapp?.includes(searchQuery)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'new' && f.status === 'new') ||
      (statusFilter === 'reviewed' && f.status === 'reviewed')
    const matchesType =
      typeFilter === 'all' || f.formType === typeFilter
    // Filtro por ciudad
    const matchesCity = cityTab === 'all' || (() => {
      if (f.formType === 'diagnosis') {
        if (cityTab === 'Tijuana') return f.city_interest === 'tijuana' || f.city_interest === 'both'
        if (cityTab === 'CDMX') return f.city_interest === 'cdmx' || f.city_interest === 'both'
      }
      if (f.formType === 'property_interest') {
        return f.properties?.city === cityTab
      }
      return true
    })()

    return matchesSearch && matchesStatus && matchesType && matchesCity
  })

  const capitalLabels: Record<string, string> = {
    yes: 'Sí tiene capital',
    no: 'No tiene capital',
    'not-sure': 'No está seguro',
  }

  const rangeLabels: Record<string, string> = {
    '500k-1m': '$500K - $1M',
    '1m-2m': '$1M - $2M',
    '2m-3m': '$2M - $3M',
    '3m-5m': '$3M - $5M',
    '5m+': 'Más de $5M',
  }

  const cityLabels: Record<string, string> = {
    tijuana: 'Tijuana',
    cdmx: 'Ciudad de México',
    both: 'Ambas ciudades',
  }

  const newCount = allForms.filter(f => f.status === 'new').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Formularios</h1>
            <p className="text-muted-foreground mt-1">Diagnósticos e interés en propiedades recibidos</p>
          </div>
          <div className="flex items-center gap-3">
            {newCount > 0 && (
              <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-full">
                {newCount} sin revisar
              </span>
            )}
            <Tabs value={cityTab} onValueChange={(v) => setCityTab(v as 'all' | 'Tijuana' | 'CDMX')}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="Tijuana">Tijuana</TabsTrigger>
                <TabsTrigger value="CDMX">CDMX</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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

          <div className="flex gap-2 flex-wrap">
            {/* Filtro por tipo */}
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={typeFilter === 'diagnosis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('diagnosis')}
              className="gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Diagnósticos
            </Button>
            <Button
              variant={typeFilter === 'property_interest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('property_interest')}
              className="gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Propiedades
            </Button>

            {/* Separador visual */}
            <div className="w-px bg-border mx-1" />

            {/* Filtro por estado */}
            {(['all', 'new', 'reviewed'] as const).map((f) => (
              <Button
                key={f}
                variant={statusFilter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(f)}
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
                key={`${form.formType}-${form.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className={`p-5 ${form.status === 'reviewed' ? 'opacity-70' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">

                      {/* Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{form.name}</h3>

                        {/* Tipo de formulario */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          form.formType === 'diagnosis'
                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                            : 'bg-violet-500/10 text-violet-600 border-violet-500/20'
                        }`}>
                          {form.formType === 'diagnosis'
                            ? <><ClipboardList className="w-3 h-3" /> Diagnóstico</>
                            : <><Building2 className="w-3 h-3" /> Interés en propiedad</>
                          }
                        </span>

                        {/* Estado */}
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

                      {/* Datos según tipo */}
                      {form.formType === 'diagnosis' ? (
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
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">WhatsApp</p>
                            <p className="text-sm font-medium">{form.whatsapp}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 md:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1">Propiedad de interés</p>
                            <p className="text-sm font-medium">{form.property_name || 'Sin especificar'}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground mb-1">Capital</p>
                            <p className="text-sm font-medium">
                              {capitalLabels[form.has_capital] || form.has_capital || 'No indicado'}
                            </p>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Recibido el {new Date(form.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
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
                          onClick={() => markAsReviewed(form.id, form.formType)}
                          className="whitespace-nowrap text-xs gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
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