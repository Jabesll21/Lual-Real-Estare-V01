import { supabase } from '@/lib/supabase'

// ================================
// FORMULARIO DE DIAGNÓSTICO
// ================================
export async function submitDiagnosis(formData: {
  name: string
  whatsapp: string
  hasCapital: string
  investmentRange: string
  hasInvestedBefore: string
  timeHorizon: string
  cityInterest: string
}) {
  try {
    // 1. Guardar en Supabase
    const { data: savedData, error } = await supabase
      .from('diagnosis_submissions')
      .insert({
        name: formData.name,
        whatsapp: formData.whatsapp,
        has_capital: formData.hasCapital,
        investment_range: formData.investmentRange,
        has_invested_before: formData.hasInvestedBefore,
        time_horizon: formData.timeHorizon,
        city_interest: formData.cityInterest,
        status: 'new'
      })
      .select()
      .single()

    if (error) throw error

    // 2. Enviar a Kommo
    await sendToKommo({
      name: formData.name,
      whatsapp: formData.whatsapp,
      leadName: `Diagnóstico - ${formData.name}`,
      source: 'Formulario de Diagnóstico',
      details: `
        Capital disponible: ${formData.hasCapital}
        Rango de inversión: ${formData.investmentRange}
        Ha invertido antes: ${formData.hasInvestedBefore}
        Horizonte temporal: ${formData.timeHorizon}
        Ciudad de interés: ${formData.cityInterest}
      `
    })

    return { success: true, data: savedData }

  } catch (error) {
    console.error('Error al enviar diagnóstico:', error)
    throw error
  }
}

// ================================
// INTERÉS EN PROPIEDAD ESPECÍFICA
// ================================
export async function submitPropertyInterest(formData: {
  name: string
  whatsapp: string
  email?: string
  propertyId: string
  propertyName: string
  message?: string
}) {
  try {
    // 1. Guardar en Supabase
    const { data: savedData, error } = await supabase
      .from('property_interests')
      .insert({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        property_id: formData.propertyId,
        property_name: formData.propertyName,
        message: formData.message,
        status: 'new'
      })
      .select()
      .single()

    if (error) throw error

    // 2. Enviar a Kommo
    await sendToKommo({
      name: formData.name,
      whatsapp: formData.whatsapp,
      leadName: `Interés en propiedad - ${formData.propertyName}`,
      source: 'Ficha de Propiedad',
      details: `
        Propiedad: ${formData.propertyName}
        Email: ${formData.email || 'No proporcionado'}
        Mensaje: ${formData.message || 'Sin mensaje'}
      `
    })

    return { success: true, data: savedData }

  } catch (error) {
    console.error('Error al enviar interés en propiedad:', error)
    throw error
  }
}

// ================================
// FUNCIÓN INTERNA - ENVIAR A KOMMO
// ================================
async function sendToKommo(data: {
  name: string
  whatsapp: string
  leadName: string
  source: string
  details: string
}) {
  const subdomain = import.meta.env.VITE_KOMMO_SUBDOMAIN
  const integrationId = import.meta.env.VITE_KOMMO_INTEGRATION_ID
  const token = import.meta.env.VITE_KOMMO_ACCESS_TOKEN

  if (!subdomain || !token) {
    console.warn('Credenciales de Kommo no configuradas')
    return
  }

  try {
    const response = await fetch(
      `https://${subdomain}.kommo.com/api/v4/leads/complex`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          name: data.leadName,
          custom_fields_values: [
            {
              field_code: 'CFV_LEAD_SOURCE',
              values: [{ value: data.source }]
            }
          ],
          _embedded: {
            contacts: [{
              name: data.name,
              custom_fields_values: [
                {
                  field_code: 'PHONE',
                  values: [{
                    value: data.whatsapp,
                    enum_code: 'WORK'
                  }]
                }
              ]
            }]
          }
        }])
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error de Kommo:', errorData)
    }

  } catch (error) {
    console.error('Error conectando con Kommo:', error)
  }
}