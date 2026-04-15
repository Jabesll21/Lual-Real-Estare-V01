import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminLayout from './AdminLayout'
import { formatPrice } from '@/lib/index'

export default function AdminPautas() {
  const [pautas, setPautas] = useState<any[]>([])
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState('')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [propSearch, setPropSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

 async function loadData() {
  setIsLoading(true)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey
  const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${token}` }

  const [pautasRes, propsRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/admin_pautas?select=*,properties(id,name,location,city,auction_price,legal_stage,images)&active=eq.true&order=created_at.desc`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/properties?select=id,name,location,city,auction_price&active=eq.true&order=name.asc`, { headers }),
  ])

  const [pautas, props] = await Promise.all([pautasRes.json(), propsRes.json()])
  setPautas(Array.isArray(pautas) ? pautas : [])
  setAllProperties(Array.isArray(props) ? props : [])
  setIsLoading(false)
}

  const handleSave = async () => {
    if (!selectedPropertyId) return
    setIsSaving(true)

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey

    await fetch(`${supabaseUrl}/rest/v1/admin_pautas`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        property_id: selectedPropertyId,
        notes: notes || null,
        active: true,
      }),
    })

    setShowForm(false)
    setSelectedPropertyId('')
    setNotes('')
    setPropSearch('')
    setIsSaving(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Quitar esta propiedad de pautas?')) return

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey

    await fetch(`${supabaseUrl}/rest/v1/admin_pautas?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${token}`,
        'Prefer': 'return=minimal',
      },
    })

    setPautas(prev => prev.filter(p => p.id !== id))
  }

  const pautaPropertyIds = pautas.map(p => p.property_id)
  const availableProperties = allProperties
    .filter(p => !pautaPropertyIds.includes(p.id))
    .filter(p =>
      !propSearch ||
      p.name.toLowerCase().includes(propSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propSearch.toLowerCase())
    )

  const filtered = pautas.filter(p => {
    const prop = p.properties
    if (!prop) return false
    const q = searchQuery.toLowerCase()
    return prop.name?.toLowerCase().includes(q) || prop.location?.toLowerCase().includes(q)
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pautas</h1>
            <p className="text-muted-foreground mt-1">
              {pautas.length} propiedades pautadas
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar pauta
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Agregar propiedad a pautas</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar propiedad</label>
                <Input
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  placeholder="Escribe para filtrar propiedades..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Seleccionar propiedad *</label>
                <select
  value={selectedPropertyId}
  onChange={(e) => setSelectedPropertyId(e.target.value)}
  className="w-full px-3 rounded-md border border-input bg-background text-sm h-48"
  size={8}
>
                  <option value="">Selecciona una propiedad...</option>
                  {availableProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.location} — ${Number(p.auction_price).toLocaleString('es-MX')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas sobre la pauta..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={isSaving || !selectedPropertyId}>
                  {isSaving ? 'Guardando...' : 'Agregar a pautas'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Buscador */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en pautas..."
            className="pl-10"
          />
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No hay propiedades pautadas</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((pauta) => {
              const prop = pauta.properties
              if (!prop) return null
              return (
                <motion.div key={pauta.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {prop.images?.[0] && (
                        <div className="w-24 h-20 shrink-0 rounded-md overflow-hidden">
                          <img
                            src={prop.images[0]}
                            alt={prop.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{prop.id}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Pautada</span>
                        </div>
                        <p className="font-semibold truncate">{prop.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {prop.location} · {prop.city}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPrice(prop.auction_price)} MXN
                        </p>
                        {pauta.notes && (
                          <p className="text-xs text-muted-foreground mt-1 bg-muted/50 rounded p-2">
                            {pauta.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Pautada el {new Date(pauta.created_at).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(pauta.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0"
                        title="Quitar de pautas"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}