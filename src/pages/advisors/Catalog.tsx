import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin, Search, FileText, Image as ImageIcon, X, Star, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAdvisor } from '@/contexts/AdvisorContext'
import { LEGAL_STAGES, formatPrice } from '@/lib/index'

export default function AdvisorCatalog() {
  const [properties, setProperties] = useState<any[]>([])
  const [dictamenPositivo, setDictamenPositivo] = useState<any[]>([])
  const [entregaInmediata, setEntregaInmediata] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const { advisorProfile } = useAdvisor()
  const navigate = useNavigate()

  useEffect(() => {
    loadCatalog()
  }, [])

  const handleLogout = async () => {
  await supabase.auth.signOut()
  navigate('/asesores')
}

  async function loadCatalog() {
  setIsLoading(true)

  const [catalogRes, dictamenRes, entregaRes] = await Promise.all([
    supabase
      .from('advisor_properties')
      .select('*, properties (*)')
      .eq('active', true),
    supabase
      .from('advisor_featured_sections')
      .select('*, properties (*)')
      .eq('section_type', 'dictamen_positivo')
      .eq('active', true),
    supabase
      .from('advisor_featured_sections')
      .select('*, properties (*)')
      .eq('section_type', 'entrega_inmediata')
      .eq('active', true),
  ])

  const catalogData = catalogRes.data || []

  // Enriquecer secciones con datos extra de advisor_properties
  const enrichWithExtras = (items: any[]) =>
    items.map(item => {
      const extra = catalogData.find(c => c.property_id === item.property_id)
      return {
        ...item,
        rpp_document_url: extra?.rpp_document_url || null,
        map_lat: extra?.map_lat || null,
        map_lng: extra?.map_lng || null,
        extra_notes: extra?.extra_notes || null,
      }
    })

  setProperties(catalogData)
  setDictamenPositivo(enrichWithExtras(dictamenRes.data || []))
  setEntregaInmediata(enrichWithExtras(entregaRes.data || []))
  setIsLoading(false)
}

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const prop = p.properties
      if (!prop) return false
      const q = searchQuery.toLowerCase()
      return (
        prop.name?.toLowerCase().includes(q) ||
        prop.location?.toLowerCase().includes(q)
      )
    })
  }, [properties, searchQuery])

  const PropertyCard = ({ item, showExtras = true }: { item: any, showExtras?: boolean }) => {
    const prop = item.properties
    if (!prop) return null
    const legalInfo = LEGAL_STAGES[prop.legal_stage] || {
      label: prop.legal_stage,
      color: 'bg-slate-100 text-slate-700 border-slate-300'
    }
    const hasExtras = showExtras && (item.rpp_document_url || (item.map_lat && item.map_lng))

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
        {/* Imagen */}
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
          onClick={() => prop.images?.length > 0 && setSelected(item)}
        >
          {prop.images && prop.images.length > 0 ? (
            <>
              <img
                src={prop.images[0]}
                alt={prop.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {prop.images.length > 1 && (
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {prop.images.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${legalInfo.color}`}>
              {legalInfo.label}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-3 flex flex-col flex-1 gap-2">
          <div>
            <p className="font-semibold text-sm leading-tight mb-0.5">{prop.name}</p>
            <div className="flex items-start gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{prop.location}</span>
            </div>
          </div>

          <p className="text-base font-bold text-primary">
            {formatPrice(prop.auction_price)}
            <span className="text-xs font-normal text-muted-foreground ml-1">MXN</span>
          </p>

          {hasExtras && (
            <div className="flex gap-1.5 flex-wrap">
              {item.rpp_document_url && (
                <button
                  onClick={() => window.open(item.rpp_document_url, '_blank')}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors font-medium"
                >
                  <FileText className="w-3 h-3" />
                  Ver RPP
                </button>
              )}
              {item.map_lat && item.map_lng && (
                <button
                  onClick={() => window.open(
                    `https://www.google.com/maps?q=${item.map_lat},${item.map_lng}`,
                    '_blank'
                  )}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors font-medium"
                >
                  <MapPin className="w-3 h-3" />
                  Ver mapa
                </button>
              )}
            </div>
          )}

          {item.extra_notes && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 line-clamp-2">
              {item.extra_notes}
            </p>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/LOGO LUAL-01.png" alt="LUAL" className="h-7 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Portal de Asesores</p>
              <p className="text-xs text-muted-foreground">{advisorProfile?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-10">

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* SECCIÓN: Dictamen Positivo */}
            {dictamenPositivo.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Dictamen Positivo</h2>
                    <p className="text-xs text-muted-foreground">
                      Propiedades con dictamen jurídico favorable
                    </p>
                  </div>
                  <span className="ml-auto text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium">
                    {dictamenPositivo.length} propiedades
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {dictamenPositivo.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PropertyCard item={item} showExtras={true} />

                            </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN: Entrega Inmediata */}
            {entregaInmediata.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Entrega Inmediata</h2>
                    <p className="text-xs text-muted-foreground">
                      Propiedades listas para entrega
                    </p>
                  </div>
                  <span className="ml-auto text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full font-medium">
                    {entregaInmediata.length} propiedades
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {entregaInmediata.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PropertyCard item={item} showExtras={true} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN: Catálogo completo */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-bold">Catálogo Completo</h2>
                  <p className="text-xs text-muted-foreground">
                    Todas las propiedades disponibles
                  </p>
                </div>
                <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  {filtered.length} propiedades
                </span>
              </div>

              {/* Buscador */}
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar propiedad o ubicación..."
                  className="pl-10 h-9"
                />
              </div>

              {filtered.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground text-sm">No se encontraron propiedades</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PropertyCard item={item} />
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Modal de fotos */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/80 py-2 px-1 backdrop-blur-sm">
              <h3 className="text-white font-semibold">{selected.properties?.name}</h3>
              <button onClick={() => setSelected(null)} className="text-white hover:text-gray-300 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selected.properties?.images?.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`Foto ${i + 1}`}
                  className="w-full aspect-video object-cover rounded-lg cursor-pointer hover:opacity-90"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}