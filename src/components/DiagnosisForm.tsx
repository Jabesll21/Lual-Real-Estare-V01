import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DiagnosisFormData, INVESTMENT_RANGES, validateWhatsApp } from '@/lib/index'

const step1Schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  whatsapp: z.string().refine(validateWhatsApp, 'Número de WhatsApp inválido (10-13 dígitos)'),
})

const step2Schema = z.object({
  hasCapital: z.enum(['yes', 'no', 'not-sure']),
  investmentRange: z.string().min(1, 'Selecciona un rango de inversión'),
  hasInvestedBefore: z.enum(['yes', 'no']),
})

const step3Schema = z.object({
  timeHorizon: z.enum(['0-6', '6-12', '12-24', '24+']),
  cityInterest: z.enum(['tijuana', 'cdmx', 'both']),
})

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

interface DiagnosisFormProps {
  onSuccess?: () => void
}

export function DiagnosisForm({ onSuccess }: DiagnosisFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showNoCapitalWarning, setShowNoCapitalWarning] = useState(false)

  const form = useForm<DiagnosisFormData>({
    resolver: zodResolver(
      currentStep === 1 ? step1Schema : currentStep === 2 ? step2Schema : step3Schema
    ),
    mode: 'onChange',
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form

  const hasCapital = watch('hasCapital')
  const investmentRange = watch('investmentRange')
  const hasInvestedBefore = watch('hasInvestedBefore')
  const timeHorizon = watch('timeHorizon')
  const cityInterest = watch('cityInterest')

  const handleNext = async () => {
    const isValid = await form.trigger()
    if (!isValid) return

    if (currentStep === 2 && hasCapital === 'no') {
      setShowNoCapitalWarning(true)
      return
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setShowNoCapitalWarning(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setShowNoCapitalWarning(false)
    }
  }

  const onSubmit = (data: DiagnosisFormData) => {
    console.log('Diagnosis form submitted:', data)
    setIsSubmitted(true)
    onSuccess?.()
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
          <h3 className="text-2xl font-semibold mb-3">¡Diagnóstico enviado!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Gracias por tu interés. Nuestro equipo revisará tu perfil y te contactará por WhatsApp en las próximas 48 horas con oportunidades que coincidan con tu búsqueda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.location.href = 'https://wa.me/526641234567?text=Hola%2C%20acabo%20de%20completar%20el%20diagn%C3%B3stico'}
              className="gap-2"
            >
              Contactar por WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/#oportunidades'}
            >
              Ver Oportunidades
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
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
                      {...register('name')}
                      placeholder="Juan Pérez"
                      className="h-12 text-base"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-base">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      {...register('whatsapp')}
                      placeholder="6641234567"
                      className="h-12 text-base"
                    />
                    {errors.whatsapp && (
                      <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Incluye código de país si estás fuera de México</p>
                  </div>
                </div>
              </div>
            )}

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
                      Los remates bancarios requieren pago de contado. Si no cuentas con capital disponible, te recomendamos explorar otras opciones de financiamiento antes de continuar.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base">¿Tienes capital disponible para pago de contado?</Label>
                    <RadioGroup
                      value={hasCapital}
                      onValueChange={(value) => setValue('hasCapital', value as 'yes' | 'no' | 'not-sure')}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="yes" id="capital-yes" />
                        <Label htmlFor="capital-yes" className="flex-1 cursor-pointer font-normal">Sí, tengo capital disponible</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="not-sure" id="capital-not-sure" />
                        <Label htmlFor="capital-not-sure" className="flex-1 cursor-pointer font-normal">No estoy seguro</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="no" id="capital-no" />
                        <Label htmlFor="capital-no" className="flex-1 cursor-pointer font-normal">No, necesito financiamiento</Label>
                      </div>
                    </RadioGroup>
                    {errors.hasCapital && (
                      <p className="text-sm text-destructive">{errors.hasCapital.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentRange" className="text-base">Rango de inversión</Label>
                    <Select value={investmentRange} onValueChange={(value) => setValue('investmentRange', value)}>
                      <SelectTrigger id="investmentRange" className="h-12 text-base">
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
                    {errors.investmentRange && (
                      <p className="text-sm text-destructive">{errors.investmentRange.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">¿Has invertido en bienes raíces antes?</Label>
                    <RadioGroup
                      value={hasInvestedBefore}
                      onValueChange={(value) => setValue('hasInvestedBefore', value as 'yes' | 'no')}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="yes" id="invested-yes" />
                        <Label htmlFor="invested-yes" className="flex-1 cursor-pointer font-normal">Sí, tengo experiencia</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="no" id="invested-no" />
                        <Label htmlFor="invested-no" className="flex-1 cursor-pointer font-normal">No, sería mi primera inversión</Label>
                      </div>
                    </RadioGroup>
                    {errors.hasInvestedBefore && (
                      <p className="text-sm text-destructive">{errors.hasInvestedBefore.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Intención de inversión</h3>
                  <p className="text-muted-foreground">Últimos detalles para personalizar tu diagnóstico</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base">Horizonte temporal</Label>
                    <RadioGroup
                      value={timeHorizon}
                      onValueChange={(value) => setValue('timeHorizon', value as '0-6' | '6-12' | '12-24' | '24+')}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="0-6" id="horizon-0-6" />
                        <Label htmlFor="horizon-0-6" className="flex-1 cursor-pointer font-normal">0-6 meses (urgente)</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="6-12" id="horizon-6-12" />
                        <Label htmlFor="horizon-6-12" className="flex-1 cursor-pointer font-normal">6-12 meses</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="12-24" id="horizon-12-24" />
                        <Label htmlFor="horizon-12-24" className="flex-1 cursor-pointer font-normal">12-24 meses</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="24+" id="horizon-24+" />
                        <Label htmlFor="horizon-24+" className="flex-1 cursor-pointer font-normal">Más de 24 meses (flexible)</Label>
                      </div>
                    </RadioGroup>
                    {errors.timeHorizon && (
                      <p className="text-sm text-destructive">{errors.timeHorizon.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Ciudad de interés</Label>
                    <RadioGroup
                      value={cityInterest}
                      onValueChange={(value) => setValue('cityInterest', value as 'tijuana' | 'cdmx' | 'both')}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="tijuana" id="city-tijuana" />
                        <Label htmlFor="city-tijuana" className="flex-1 cursor-pointer font-normal">Tijuana</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="cdmx" id="city-cdmx" />
                        <Label htmlFor="city-cdmx" className="flex-1 cursor-pointer font-normal">Ciudad de México</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <RadioGroupItem value="both" id="city-both" />
                        <Label htmlFor="city-both" className="flex-1 cursor-pointer font-normal">Ambas ciudades</Label>
                      </div>
                    </RadioGroup>
                    {errors.cityInterest && (
                      <p className="text-sm text-destructive">{errors.cityInterest.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 gap-2"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="flex-1 gap-2"
                >
                  Enviar Diagnóstico
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
