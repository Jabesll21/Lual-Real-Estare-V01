import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import AdminLayout from './AdminLayout'
import { ImageUploader } from '@/components/ImageUploader'

export default function AdminProperties() {
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)

  const emptyForm = {
  id: '',
  name: '',
  location: '',
  city: 'Tijuana',
  type: 'Casa',
  legal_stage: 'remate',
  commercial_price: '',
  auction_price: '',
  discount: '',
  bedrooms: '',
  bathrooms: '',
  sqm: '',
  parking: '',
  description: '',
  featured: false,
  active: true,
  images: [] as string[], 
}

  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    setIsLoading(true)
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    setProperties(data || [])
    setIsLoading(false)
  }

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleEdit = (property: any) => {
    setEditingProperty(property)
    setForm({
      id: property.id,
      name: property.name,
      location: property.location,
      city: property.city,
      type: property.type,
      legal_stage: property.legal_stage,
      commercial_price: property.commercial_price,
      auction_price: property.auction_price,
      discount: property.discount,
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      sqm: property.sqm,
      parking: property.parking || '',
      description: property.description || '',
      featured: property.featured,
      active: property.active,
      images: property.images || [],
    })
    setShowForm(true)
  }

  const handleNew = () => {
    setEditingProperty(null)
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    setFormError('')

    if (!form.name || !form.location || !form.commercial_price || !form.auction_price || !form.sqm) {
      setFormError('Por favor completa los campos obligatorios')
      return
    }

    if (!form.id && !editingProperty) {
      setFormError('El ID de la propiedad es obligatorio')
      return
    }

    setIsSaving(true)

    const data = {
      name: form.name,
      location: form.location,
      city: form.city,
      type: form.type,
      legal_stage: form.legal_stage,
      commercial_price: Number(form.commercial_price),
      auction_price: Number(form.auction_price),
      discount: Number(form.discount),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      sqm: Number(form.sqm),
      parking: form.parking ? Number(form.parking) : null,
      description: form.description,
      featured: form.featured,
      active: form.active,
      images: form.images,
    }

    let error

    if (editingProperty) {
      const res = await supabase
        .from('properties')
        .update(data)
        .eq('id', editingProperty.id)
      error = res.error
    } else {
      const res = await supabase
        .from('properties')
        .insert({ ...data, id: form.id })
      error = res.error
    }

    setIsSaving(false)

    if (error) {
      setFormError('Error al guardar: ' + error.message)
      return
    }

    setShowForm(false)
    loadProperties()
  }

  const handleToggleActive = async (property: any) => {
    await supabase
      .from('properties')
      .update({ active: !property.active })
      .eq('id', property.id)
    loadProperties()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    await supabase.from('properties').delete().eq('id', id)
    loadProperties()
  }

  const filtered = properties.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Propiedades</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona el inventario de propiedades
            </p>
          </div>
          <Button onClick={handleNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva propiedad
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {editingProperty ? 'Editar propiedad' : 'Nueva propiedad'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!editingProperty && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium">ID único *</label>
                    <Input
                      value={form.id}
                      onChange={(e) => updateForm('id', e.target.value)}
                      placeholder="ej: tj-006 o cdmx-006"
                    />
                    <p className="text-xs text-muted-foreground">
                      Usa formato: ciudad-número (tj-006, cdmx-003)
                    </p>
                  </div>
                )}

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="ej: Residencia Moderna Playas"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium">Ubicación *</label>
                  <Input
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    placeholder="ej: Playas de Tijuana, Sección Monumental"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Ciudad *</label>
                  <select
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Tijuana">Tijuana</option>
                    <option value="CDMX">CDMX</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Tipo *</label>
                  <select
                    value={form.type}
                    onChange={(e) => updateForm('type', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Local Comercial">Local Comercial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Etapa legal *</label>
                  <select
                    value={form.legal_stage}
                    onChange={(e) => updateForm('legal_stage', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="adjudicacion">Adjudicación</option>
                    <option value="remate">Remate</option>
                    <option value="dacion">Dación en Pago</option>
                    <option value="preventa">Preventa</option>
                    <option value="escrituracion">Escrituración</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Descuento % *</label>
                  <Input
                    type="number"
                    value={form.discount}
                    onChange={(e) => updateForm('discount', e.target.value)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Precio comercial *</label>
                  <Input
                    type="number"
                    value={form.commercial_price}
                    onChange={(e) => updateForm('commercial_price', e.target.value)}
                    placeholder="4800000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Precio de remate *</label>
                  <Input
                    type="number"
                    value={form.auction_price}
                    onChange={(e) => updateForm('auction_price', e.target.value)}
                    placeholder="3360000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">M² *</label>
                  <Input
                    type="number"
                    value={form.sqm}
                    onChange={(e) => updateForm('sqm', e.target.value)}
                    placeholder="280"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Recámaras</label>
                  <Input
                    type="number"
                    value={form.bedrooms}
                    onChange={(e) => updateForm('bedrooms', e.target.value)}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Baños</label>
                  <Input
                    type="number"
                    value={form.bathrooms}
                    onChange={(e) => updateForm('bathrooms', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Cajones de estacionamiento</label>
                  <Input
                    type="number"
                    value={form.parking}
                    onChange={(e) => updateForm('parking', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Descripción detallada de la propiedad..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
  <label className="text-sm font-medium">Imágenes de la propiedad</label>
  <ImageUploader
    propertyId={editingProperty?.id || form.id || 'nueva'}
    currentImages={form.images}
    onImagesChange={(images) => updateForm('images', images)}
  />
</div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => updateForm('featured', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Destacada</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => updateForm('active', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Activa</span>
                  </label>
                </div>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : editingProperty ? 'Guardar cambios' : 'Crear propiedad'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
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
            placeholder="Buscar propiedad..."
            className="pl-10"
          />
        </div>

        {/* Lista de propiedades */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className={`p-4 ${!property.active ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {property.id}
                        </span>
                        {property.featured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Destacada
                          </span>
                        )}
                        {!property.active && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className="font-semibold truncate">{property.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {property.location} · {property.city} · {property.type}
                      </p>
                    </div>

                    <div className="text-right hidden md:block">
                      <p className="font-mono text-sm font-semibold text-primary">
                        ${Number(property.auction_price).toLocaleString('es-MX')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.discount}% descuento
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(property)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title={property.active ? 'Desactivar' : 'Activar'}
                      >
                        {property.active
                          ? <ToggleRight className="w-5 h-5 text-primary" />
                          : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                        }
                      </button>
                      <button
                        onClick={() => handleEdit(property)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                        title="Eliminar"
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