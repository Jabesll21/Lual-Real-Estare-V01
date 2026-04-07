import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Search, MapPin, FileText, Upload, Pencil, Star, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'
import { LEGAL_STAGES, formatPrice } from '@/lib/index'
import { useRef } from 'react'


export default function AdminAdvisorCatalog() {
  const [catalogItems, setCatalogItems] = useState<any[]>([])
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [formError, setFormError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const formRef = useRef<HTMLDivElement>(null)
const PAGE_SIZE = 30
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState({
    property_id: '',
    rpp_document_url: '',
    map_lat: '',
    map_lng: '',
    map_location: '',
    extra_notes: '',
  })

  const handleAddToSection = async (sectionType: 'dictamen_positivo' | 'entrega_inmediata') => {
  if (!sectionPropertyId) return

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  await fetch(`${supabaseUrl}/rest/v1/advisor_featured_sections`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ section_type: sectionType, property_id: sectionPropertyId, active: true }),
  })

  setSectionPropertyId('')
  setShowSectionForm(null)
  loadSections()
}

const handleRemoveFromSection = async (id: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
  const token = authData ? JSON.parse(authData).access_token : supabaseKey

  await fetch(`${supabaseUrl}/rest/v1/advisor_featured_sections?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=minimal',
    },
  })

  loadSections()
}

 useEffect(() => {
  loadData()
  loadSections()
}, [currentPage])

  const [featuredSections, setFeaturedSections] = useState<{
  dictamen_positivo: any[],
  entrega_inmediata: any[]
}>({ dictamen_positivo: [], entrega_inmediata: [] })
const [showSectionForm, setShowSectionForm] = useState<'dictamen_positivo' | 'entrega_inmediata' | null>(null)
const [sectionPropertyId, setSectionPropertyId] = useState('')

 async function loadData() {
  setIsLoading(true)
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey
    const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${token}` }

    const [catalogRes, propertiesRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/advisor_properties?select=id,property_id,rpp_document_url,map_lat,map_lng,map_location,extra_notes,active,properties(id,name,location,city,auction_price,legal_stage,images)&active=eq.true&order=created_at.desc`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/properties?select=id,name,location,city&active=eq.true&order=name.asc`, { headers }),
    ])

    const [catalog, properties] = await Promise.all([
      catalogRes.json(),
      propertiesRes.json(),
    ])

    setCatalogItems(Array.isArray(catalog) ? catalog : [])
    setAllProperties(Array.isArray(properties) ? properties : [])
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    setIsLoading(false)
  }
}

async function loadSections() {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey
    const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${token}` }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/advisor_featured_sections?select=*,properties(id,name,location)&active=eq.true`,
      { headers }
    )
    const data = await res.json()
    const items = Array.isArray(data) ? data : []

    setFeaturedSections({
      dictamen_positivo: items.filter((d: any) => d.section_type === 'dictamen_positivo'),
      entrega_inmediata: items.filter((d: any) => d.section_type === 'entrega_inmediata'),
    })
  } catch (error) {
    console.error('Error cargando secciones:', error)
  }
}

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

 const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.type !== 'application/pdf') {
    setFormError('Solo se permiten archivos PDF')
    return
  }

  if (file.size > 20 * 1024 * 1024) {
    setFormError('El PDF no puede pesar más de 20MB')
    return
  }

  setIsUploadingPdf(true)
  setFormError('')

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey

    const fileName = `rpp/${Date.now()}-${file.name.replace(/\s/g, '_')}`

    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/property-documents/${fileName}`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: file,
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/property-documents/${fileName}`
    updateForm('rpp_document_url', publicUrl)
  } catch (error: any) {
    setFormError('Error al subir PDF: ' + (error?.message || 'Error desconocido'))
  } finally {
    setIsUploadingPdf(false)
    e.target.value = ''
  }
}

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      property_id: item.property_id,
      rpp_document_url: item.rpp_document_url || '',
      map_lat: item.map_lat ? String(item.map_lat) : '',
      map_lng: item.map_lng ? String(item.map_lng) : '',
      map_location: item.map_location || '',
      extra_notes: item.extra_notes || '',
    })
    setShowForm(true)
    setFormError('')
    setTimeout(() => {
  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}, 100)
  }

  const handleNew = () => {
    setEditingItem(null)
    setForm({
      property_id: '',
      rpp_document_url: '',
      map_lat: '',
      map_lng: '',
      map_location: '',
      extra_notes: '',
    })
    setFormError('')
    setShowForm(true)
  }

 const handleSave = async () => {
  setFormError('')
  setIsSaving(true)

  try {
    const dataToSave: any = {
      active: true,
      rpp_document_url: form.rpp_document_url || null,
      map_lat: form.map_lat ? Number(form.map_lat) : null,
      map_lng: form.map_lng ? Number(form.map_lng) : null,
      map_location: form.map_location || null,
      extra_notes: form.extra_notes || null,
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // Obtener token de sesión del localStorage directamente
    const authData = localStorage.getItem('sb-jsadaigsymrbovdhiybq-auth-token')
    const token = authData ? JSON.parse(authData).access_token : supabaseKey

    let url: string
    let method: string

    if (editingItem) {
      url = `${supabaseUrl}/rest/v1/advisor_properties?id=eq.${editingItem.id}`
      method = 'PATCH'
    } else {
      dataToSave.property_id = form.property_id
      url = `${supabaseUrl}/rest/v1/advisor_properties`
      method = 'POST'
    }

    const response = await fetch(url, {
      method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(dataToSave),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error ${response.status}: ${errorText}`)
    }

    setShowForm(false)
    setEditingItem(null)
    await loadData()
  } catch (error: any) {
    console.error('Error al guardar:', error)
    setFormError('Error: ' + (error?.message || 'Error desconocido'))
  } finally {
    setIsSaving(false)
  }
}

  const handleDelete = async (id: string) => {
    if (!confirm('¿Quitar esta propiedad del catálogo de asesores?')) return
    await supabase.from('advisor_properties').delete().eq('id', id)
    loadData()
  }

  const filtered = catalogItems.filter(item => {
    const prop = item.properties
    if (!prop) return false
    const q = searchQuery.toLowerCase()
    return (
      prop.name?.toLowerCase().includes(q) ||
      prop.location?.toLowerCase().includes(q)
    )
  })

  // Solo mostrar propiedades no agregadas al crear nuevo
  const catalogPropertyIds = catalogItems
    .filter(i => !editingItem || i.id !== editingItem.id)
    .map(i => i.property_id)
  const availableProperties = allProperties.filter(p => !catalogPropertyIds.includes(p.id))

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Catálogo de Asesores</h1>
            <p className="text-muted-foreground mt-1">
              {catalogItems.length} propiedades en el catálogo exclusivo
            </p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar propiedad
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
  <motion.div
    ref={formRef}
    key={editingItem?.id || 'new'}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
  >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingItem ? 'Editar información extra' : 'Agregar al catálogo'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Propiedad *</Label>
                  {editingItem ? (
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="font-medium">{editingItem.properties?.name}</p>
                      <p className="text-muted-foreground text-xs">{editingItem.properties?.location}</p>
                    </div>
                  ) : (
                    <select
                      value={form.property_id}
                      onChange={(e) => updateForm('property_id', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Selecciona una propiedad...</option>
                      {availableProperties.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.location}, {p.city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* PDF RPP */}
                <div className="md:col-span-2 space-y-2">
                  <Label>Documento RPP (PDF)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <input
                      type="file"
                      id="pdf-upload"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={isUploadingPdf}
                    />
                  
                    {form.rpp_document_url ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">PDF subido correctamente</p>
                            <a
                              href={form.rpp_document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              Ver documento
                            </a>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateForm('rpp_document_url', '')}
                        >
                          Cambiar
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="pdf-upload"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        {isUploadingPdf ? (
                          <>
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-muted-foreground">Subiendo PDF...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <p className="text-sm font-medium">Haz clic para subir el RPP</p>
                            <p className="text-xs text-muted-foreground">PDF hasta 20MB</p>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Latitud</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.map_lat}
                    onChange={(e) => updateForm('map_lat', e.target.value)}
                    placeholder="32.5149"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Longitud</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.map_lng}
                    onChange={(e) => updateForm('map_lng', e.target.value)}
                    placeholder="-117.0382"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Descripción de ubicación</Label>
                  <Input
                    value={form.map_location}
                    onChange={(e) => updateForm('map_location', e.target.value)}
                    placeholder="ej: Cerca del parque, esquina con Av. Principal"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label>Notas para el asesor</Label>
                  <textarea
                    value={form.extra_notes}
                    onChange={(e) => updateForm('extra_notes', e.target.value)}
                    placeholder="Información adicional relevante para el asesor..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={isSaving || isUploadingPdf}>
                  {isSaving ? 'Guardando...' : editingItem ? 'Guardar cambios' : 'Agregar al catálogo'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingItem(null) }}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Secciones especiales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dictamen Positivo */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-sm">Dictamen Positivo</h3>
                <span className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full">
                  {featuredSections.dictamen_positivo.length}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setShowSectionForm(
                  showSectionForm === 'dictamen_positivo' ? null : 'dictamen_positivo'
                )}
              >
                <Plus className="w-3 h-3 mr-1" />
                Agregar
              </Button>
            </div>

            {showSectionForm === 'dictamen_positivo' && (
              <div className="flex gap-2 mb-3">
                <select
                  value={sectionPropertyId}
                  onChange={(e) => setSectionPropertyId(e.target.value)}
                  className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="">Selecciona propiedad...</option>
                  {allProperties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.location}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleAddToSection('dictamen_positivo')}
                >
                  Agregar
                </Button>
              </div>
            )}

            <div className="space-y-1.5">
              {featuredSections.dictamen_positivo.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">Sin propiedades</p>
              ) : (
                featuredSections.dictamen_positivo.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{item.properties?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.properties?.location}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromSection(item.id)}
                      className="p-1 hover:text-destructive transition-colors shrink-0 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Entrega Inmediata */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-sm">Entrega Inmediata</h3>
                <span className="text-xs bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded-full">
                  {featuredSections.entrega_inmediata.length}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => setShowSectionForm(
                  showSectionForm === 'entrega_inmediata' ? null : 'entrega_inmediata'
                )}
              >
                <Plus className="w-3 h-3 mr-1" />
                Agregar
              </Button>
            </div>

            {showSectionForm === 'entrega_inmediata' && (
              <div className="flex gap-2 mb-3">
                <select
                  value={sectionPropertyId}
                  onChange={(e) => setSectionPropertyId(e.target.value)}
                  className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="">Selecciona propiedad...</option>
                  {allProperties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.location}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleAddToSection('entrega_inmediata')}
                >
                  Agregar
                </Button>
              </div>
            )}

            <div className="space-y-1.5">
              {featuredSections.entrega_inmediata.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">Sin propiedades</p>
              ) : (
                featuredSections.entrega_inmediata.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{item.properties?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.properties?.location}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromSection(item.id)}
                      className="p-1 hover:text-destructive transition-colors shrink-0 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Buscador */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en catálogo..."
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
            <p className="text-muted-foreground">No hay propiedades en el catálogo de asesores</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const prop = item.properties
              if (!prop) return null
              const legalInfo = LEGAL_STAGES[prop.legal_stage] || { label: prop.legal_stage, color: '' }

              return (
                <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3 flex-1 min-w-0">
                        {prop.images?.[0] && (
                          <img
                            src={prop.images[0]}
                            alt={prop.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold truncate">{prop.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${legalInfo.color}`}>
                              {legalInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{prop.location}, {prop.city}</span>
                          </div>
                          <p className="text-sm font-semibold text-primary mb-2">
                            {formatPrice(prop.auction_price)} MXN
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            {item.rpp_document_url && (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <FileText className="w-3 h-3" />
                                RPP adjunto
                              </span>
                            )}
                            {item.map_lat && (
                              <span className="flex items-center gap-1 text-xs text-blue-600">
                                <MapPin className="w-3 h-3" />
                                Ubicación
                              </span>
                            )}
                            {item.extra_notes && (
                              <span className="text-xs text-muted-foreground">· Con notas</span>
                            )}
                            {!item.rpp_document_url && !item.map_lat && !item.extra_notes && (
                              <span className="text-xs text-orange-500">· Sin información extra</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                          title="Agregar información extra"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                          title="Quitar del catálogo"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
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