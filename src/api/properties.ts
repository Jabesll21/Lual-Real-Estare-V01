import { supabase } from '@/lib/supabase'
import { Property } from '@/lib/index'

// Convertir formato de Supabase al formato que usa la página
function mapProperty(row: any): Property {
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
      : ['https://images.unsplash.com/photo-1757439402186-86cf1d31c4df?w=1080'],
    description: row.description || '',
    featured: row.featured || false,
  }
}

// Obtener todas las propiedades activas
export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando propiedades:', error)
    return []
  }

  return data.map(mapProperty)
}

// Obtener solo propiedades destacadas
export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando propiedades destacadas:', error)
    return []
  }

  return data.map(mapProperty)
}

// Obtener propiedades por ciudad
export async function getPropertiesByCity(city: 'Tijuana' | 'CDMX'): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('active', true)
    .eq('city', city)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando propiedades por ciudad:', error)
    return []
  }

  return data.map(mapProperty)
}