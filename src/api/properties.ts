const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function querySupabase(table: string, params: string) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?${params}`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      keepalive: true,
    }
  )
  if (!response.ok) throw new Error(`Error ${response.status}`)
  return response.json()
}

function mapProperty(row: any) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    city: row.city,
    type: row.type,
    legalStage: row.legal_stage,
    commercialPrice: row.commercial_price,
    auctionPrice: row.auction_price,
    discount: row.discount,
    specs: {
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      sqm: row.sqm,
      parking: row.parking,
    },
    images: row.images && row.images.length > 0
      ? row.images
      : ['https://images.unsplash.com/photo-1757439402186-86cf1d31c4df?w=800'],
    description: row.description || '',
    featured: row.featured || false,
  }
}

export async function getProperties() {
  try {
    const data = await querySupabase('properties', 'active=eq.true&order=created_at.desc')
    return data.map(mapProperty)
  } catch (error) {
    console.error('Error cargando propiedades:', error)
    return []
  }
}

export async function getFeaturedProperties() {
  try {
    const data = await querySupabase('properties', 'active=eq.true&featured=eq.true&order=created_at.desc')
    return data.map(mapProperty)
  } catch (error) {
    console.error('Error cargando propiedades destacadas:', error)
    return []
  }
}

export async function getHighlightedProperties() {
  try {
    const [entregaData, dictamenData] = await Promise.all([
      querySupabase('properties', 'active=eq.true&legal_stage=eq.entrega_inmediata&order=created_at.desc'),
      querySupabase('advisor_featured_sections', 'select=*,properties(*)&active=eq.true&section_type=eq.dictamen_positivo'),
    ])

    console.log('[dictamen raw]', dictamenData)
    const entregaProps = entregaData.map(mapProperty)
    const dictamenProps = (dictamenData as any[])
      .map((row: any) => row.properties)
      .filter(Boolean)
      .map(mapProperty)

    const seen = new Set<string>()
    return [...entregaProps, ...dictamenProps].filter(p => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })
  } catch (error) {
    console.error('Error cargando propiedades destacadas:', error)
    return []
  }
}

export async function getImmediateDeliveryProperties() {
  try {
    const data = await querySupabase('properties', 'active=eq.true&legal_stage=eq.entrega_inmediata&order=created_at.desc&limit=9')
    return data.map(mapProperty)
  } catch (error) {
    console.error('Error cargando propiedades de entrega inmediata:', error)
    return []
  }
}

export async function getPropertiesByCity(city: 'Tijuana' | 'CDMX') {
  try {
    const data = await querySupabase('properties', `active=eq.true&city=eq.${city}&order=created_at.desc`)
    return data.map(mapProperty)
  } catch (error) {
    console.error('Error cargando propiedades por ciudad:', error)
    return []
  }
}