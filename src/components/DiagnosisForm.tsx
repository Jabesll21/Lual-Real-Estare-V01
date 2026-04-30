import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { INVESTMENT_RANGES } from '@/lib/index'
import { submitDiagnosis } from '@/api/submissions'

interface DiagnosisFormProps {
  onSuccess?: () => void
}

export function DiagnosisForm({ onSuccess }: DiagnosisFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNoCapitalWarning, setShowNoCapitalWarning] = useState(false)

  // Estado del formulario controlado manualmente
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    hasCapital: '',
    investmentRange: '',
    hasInvestedBefore: '',
    timeHorizon: '',
    cityInterest: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres'
    }
    const cleaned = formData.whatsapp.replace(/\D/g, '')
    if (!cleaned || cleaned.length < 10 || cleaned.length > 13) {
      newErrors.whatsapp = 'Número de WhatsApp inválido (10-13 dígitos)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.hasCapital) newErrors.hasCapital = 'Selecciona una opción'
    if (!formData.investmentRange) newErrors.investmentRange = 'Selecciona un rango'
    if (!formData.hasInvestedBefore) newErrors.hasInvestedBefore = 'Selecciona una opción'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.timeHorizon) newErrors.timeHorizon = 'Selecciona una opción'
    if (!formData.cityInterest) newErrors.cityInterest = 'Selecciona una ciudad'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2) {
      if (!validateStep2()) return
      if (formData.hasCapital === 'no') {
        setShowNoCapitalWarning(true)
        return
      }
    }
    setCurrentStep(prev => prev + 1)
    setShowNoCapitalWarning(false)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setShowNoCapitalWarning(false)
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return

    console.log('Enviando datos:', formData)
    setIsLoading(true)

    try {
      await submitDiagnosis(formData)
      setIsSubmitted(true)
      onSuccess?.()
    } catch (error) {
      console.error('Error al enviar:', error)
      alert('Hubo un error al enviar el formulario. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const progressPercentage = (currentStep / 3) * 100

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-accent" />
          </motion.div>
          <h3 className="text-2xl font-semibold mb-3">¡Solicitud enviada!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Gracias por tu interés. Nuestro equipo revisará tu perfil y te contactará por WhatsApp en las próximas 48 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.open('https://wa.me/526632007261?text=Hola%2C%20acabo%20de%20completar%20la%20asesoría%20personalizada%20y%20me%20gustaría%20saber%20cuáles%20son%20mis%20opciones%20de%20inversión.', '_blank')}
              className="gap-2"
            >
              Contactar por WhatsApp
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/#oportunidades'}>
              Ver Oportunidades
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">Paso {currentStep} de 3</span>
          <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">

            {/* PASO 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Datos de contacto</h3>
                  <p className="text-muted-foreground">Comencemos con tu información básica</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Juan Pérez"
                      className="h-12 text-base"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-base">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                      placeholder="6641234567"
                      className="h-12 text-base"
                    />
                    {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                    <p className="text-xs text-muted-foreground">Incluye código de país si estás fuera de México</p>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Perfil de inversión</h3>
                  <p className="text-muted-foreground">Ayúdanos a entender tu situación financiera</p>
                </div>

                {showNoCapitalWarning && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Los remates bancarios requieren pago de contado. Si no cuentas con capital disponible, te recomendamos explorar otras opciones antes de continuar.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base">¿Tienes capital disponible para pago de contado?</Label>
                    <RadioGroup
                      value={formData.hasCapital}
                      onValueChange={(value) => updateField('hasCapital', value)}
                    >
                      {[
                        { value: 'yes', label: 'Sí, tengo capital disponible' },
                        { value: 'no', label: 'No, necesito financiamiento' },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={`capital-${option.value}`} />
                          <Label htmlFor={`capital-${option.value}`} className="flex-1 cursor-pointer font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.hasCapital && <p className="text-sm text-destructive">{errors.hasCapital}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Rango de inversión</Label>
                    <Select value={formData.investmentRange} onValueChange={(value) => updateField('investmentRange', value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Selecciona un rango" />
                      </SelectTrigger>
                      <SelectContent>
                        {INVESTMENT_RANGES.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.investmentRange && <p className="text-sm text-destructive">{errors.investmentRange}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">¿Has invertido en Remates hipotecarios antes?</Label>
                    <RadioGroup
                      value={formData.hasInvestedBefore}
                      onValueChange={(value) => updateField('hasInvestedBefore', value)}
                    >
                      {[
                        { value: 'yes', label: 'Sí, tengo experiencia' },
                        { value: 'no', label: 'No, sería mi primera inversión' },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={`invested-${option.value}`} />
                          <Label htmlFor={`invested-${option.value}`} className="flex-1 cursor-pointer font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.hasInvestedBefore && <p className="text-sm text-destructive">{errors.hasInvestedBefore}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Intención de inversión</h3>
                  <p className="text-muted-foreground">Últimos detalles para personalizar tu solicitud</p>
                </div>
                <div className="space-y-4">
                  

                  <div className="space-y-3">
                    <Label className="text-base">Ciudad de interés</Label>
                    <RadioGroup
                      value={formData.cityInterest}
                      onValueChange={(value) => updateField('cityInterest', value)}
                    >
                      {[
                        { value: 'tijuana', label: 'Tijuana' },
                        { value: 'cdmx', label: 'Ciudad de México' },
                        { value: 'both', label: 'Ambas ciudades' },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <RadioGroupItem value={option.value} id={`city-${option.value}`} />
                          <Label htmlFor={`city-${option.value}`} className="flex-1 cursor-pointer font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.cityInterest && <p className="text-sm text-destructive">{errors.cityInterest}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              )}
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1 gap-2">
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>

          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}