import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { supabase } from '@/lib/supabase'
import { Property, formatPrice } from '@/lib/index'

interface PropertyInterestModalProps {
  property: Property
  onClose: () => void
}

export function PropertyInterestModal({ property, onClose }: PropertyInterestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    hasCapital: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [noCapitalWarning, setNoCapitalWarning] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    if (field === 'hasCapital' && value !== 'no') {
      setNoCapitalWarning(false)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Ingresa tu nombre completo'
    }
    const cleaned = formData.whatsapp.replace(/\D/g, '')
    if (!cleaned || cleaned.length < 10) {
      newErrors.whatsapp = 'Ingresa un número válido de 10 dígitos'
    }
    if (!formData.hasCapital) {
      newErrors.hasCapital = 'Selecciona una opción'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 const handleSubmit = async () => {
  if (!validate()) return

  if (formData.hasCapital === 'no') {
    setNoCapitalWarning(true)
    return
  }

  setIsSubmitting(true)

  try {
    const { error } = await supabase
      .from('property_interests')
      .insert({
        name: formData.name,
        whatsapp: formData.whatsapp,
        has_capital: formData.hasCapital,
        property_id: property.id,
        property_name: property.name,
        status: 'new',
      })

    if (error) {
      console.error('Error detallado:', error)
      throw error
    }

    setIsSubmitted(true)
  } catch (error: any) {
    console.error('Error al enviar:', error)
    alert('Error al enviar: ' + (error?.message || 'Error desconocido'))
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 relative">
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              // Pantalla de éxito
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">¡Solicitud enviada!</h3>
                <p className="text-muted-foreground mb-6">
                  Gracias por tu interés en <strong>{property.name}</strong>. 
                  Nuestro equipo te contactará por WhatsApp en las próximas horas.
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hola, acabo de solicitar información sobre: *${property.name}* en ${property.location}, ${property.city}.`
                      )
                      window.open(`https://wa.me/526632007261?text=${msg}`, '_blank')
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contactar ahora
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header con info de la propiedad */}
                <div className="mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight mb-1">
                        {property.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {property.location}, {property.city}
                      </p>
                      <p className="text-primary font-bold text-sm">
                        {formatPrice(property.auctionPrice)} MXN
                      </p>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold">Solicitar más información</h2>
                  <p className="text-sm text-muted-foreground">
                    Completa el formulario y te contactamos por WhatsApp
                  </p>
                </div>

                {/* Advertencia sin capital */}
                {noCapitalWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-4"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive mb-1">
                        Capital requerido
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Los remates bancarios requieren pago de contado. 
                        Te recomendamos primero completar nuestro diagnóstico gratuito.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Formulario */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="interest-name">Nombre completo</Label>
                    <Input
                      id="interest-name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Juan Pérez"
                      className="h-11"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="interest-whatsapp">WhatsApp</Label>
                    <Input
                      id="interest-whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="6631234567"
                      className="h-11"
                    />
                    {errors.whatsapp && (
                      <p className="text-xs text-destructive">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>¿Cuentas con capital para pago de contado?</Label>
                    <RadioGroup
                      value={formData.hasCapital}
                      onValueChange={(v) => updateField('hasCapital', v)}
                    >
                      {[
                        { value: 'yes', label: 'Sí, cuento con capital' },
                        { value: 'no', label: 'No, necesito financiamiento' },
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <RadioGroupItem value={opt.value} id={`capital-${opt.value}`} />
                          <Label
                            htmlFor={`capital-${opt.value}`}
                            className="cursor-pointer font-normal flex-1"
                          >
                            {opt.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.hasCapital && (
                      <p className="text-xs text-destructive">{errors.hasCapital}</p>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || formData.hasCapital === 'no'}
                    className="w-full h-11 gap-2 mt-2"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar información'}
                    <MessageCircle className="w-4 h-4" />
                  </Button>

                  {formData.hasCapital === 'no' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Esta propiedad requiere pago de contado
                    </p>
                  )}
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}