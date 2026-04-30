import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Search,
  Shield,
  TrendingUp,
  Users,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTE_PATHS } from '@/lib/index';
import { IMAGES } from '@/assets/images';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const dueDiligenceFilters = [
  {
    icon: FileText,
    title: 'Análisis Legal',
    description: 'Revisión exhaustiva gravámenes y situación jurídica',
  },
  {
    icon: TrendingUp,
    title: 'Valuación Comercial',
    description: 'Comparativa de precio en el mercado y valor de remate',
  },
  {
    icon: Shield,
    title: 'Verificación de Gravamen',
    description: 'Analisis y verifiacion de gravamen hipotecario',
  },
  {
    icon: Users,
    title: 'Situación de Ocupación',
    description: 'Análisis de inquilinos, desalojo o entrega inmediata',
  },
  {
    icon: Clock,
    title: 'Tiempos del Proceso',
    description: 'Estimación realista de duración según etapa juridica',
  },
  {
    icon: AlertTriangle,
    title: 'Evaluación de Riesgos',
    description: 'Identificamos las mejores oportunidades para proteger tu inversión',
  },
];

const idealProfile = [
  { label: 'Inversionista con capital disponible', isIdeal: true },
  { label: 'Horizonte de inversión 12-24 meses', isIdeal: true },
  { label: 'Interés en oportunidades de descuento real', isIdeal: true },
  { label: 'Busca acompañamiento profesional', isIdeal: true },
  { label: 'Comprende que no es entrega inmediata', isIdeal: true },
];

const notIdealProfile = [
  { label: 'Necesita financiamiento bancario', isIdeal: false },
  { label: 'Busca casa para habitar de inmediato', isIdeal: false },
  { label: 'Espera proceso rápido (menos de 6 meses)', isIdeal: false },
  { label: 'No tiene capital para pago de contado', isIdeal: false },
  { label: 'Busca casa perfecta sin inversión adicional', isIdeal: false },
  { label: 'No está dispuesto a esperar tiempos legales', isIdeal: false },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${IMAGES.LEGAL_PROCESS_1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              ¿Cómo funcionan los remates bancarios?
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparencia total. Proceso claro. Expectativas correctas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-4xl font-bold mb-6">¿Qué es un remate bancario?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                 Son propiedades que se dejaron como garantía de una credito en una institución bancaria.
                  El banco, para recuperar su inversión pone a la venta los derechos de cobro para que  mediante un proceso jurídico se llegue a la adjudicación de la propiedad.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-accent/20">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent flex-shrink-0" />
                  <h3 className="text-2xl font-semibold">Qué SÍ es</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Oportunidad de inversión con descuento real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Proceso legal formal y regulado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Requiere pago de contado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Tiempos variables según etapa legal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>Necesita análisis técnico y legal previo</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-destructive/20">
                <div className="flex items-start gap-4 mb-4">
                  <XCircle className="w-8 h-8 text-destructive flex-shrink-0" />
                  <h3 className="text-2xl font-semibold">Qué NO es</h3>
                </div>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Casa lista para habitar de inmediato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Opción con financiamiento bancario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Proceso rápido (menos de 6 meses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Propiedad perfecta sin inversión adicional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Garantía de entrega en fecha específica</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Lo que debes saber</h2>
              <p className="text-xl text-muted-foreground">
                Expectativas realistas sobre tiempos, costos y proceso
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">8-24 meses</h3>
                <p className="text-muted-foreground">
                  Duración promedio del proceso completo según etapa legal
                </p>
              </Card>

              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Pago de contado</h3>
                <p className="text-muted-foreground">
                  No aplica financiamiento bancario tradicional
                </p>
              </Card>

              <Card className="p-8 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Proceso legal</h3>
                <p className="text-muted-foreground">
                  Tiempos variables según juzgado y complejidad del caso
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 border-destructive/20 bg-destructive/5">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  Toma en cuenta que:
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Entrega inmediata:</strong> El
                      proceso legal toma tiempo. No es como comprar una casa tradicional.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Financiamiento bancario:</strong>{' '}
                      Los remates requieren pago de contado. No aplica crédito hipotecario.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Casa perfecta:</strong> La mayoría
                      de propiedades requieren inversión adicional en remodelación.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Tiempos exactos:</strong> Los
                      juzgados tienen carga de trabajo variable. No podemos garantizar fechas
                      específicas.
                    </span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">¿Cómo opera LUAL?</h2>
              <p className="text-xl text-muted-foreground">
                 6 filtros que analiza Lual para cada oportunidad
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {dueDiligenceFilters.map((filter, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <filter.icon className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{filter.title}</h3>
                    <p className="text-muted-foreground">{filter.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 text-center">
              <div
                className="relative inline-block p-8 rounded-2xl"
                style={{
                  backgroundImage: `url(${IMAGES.TEAM_PROFESSIONAL_1})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-2xl" />
                <div className="relative z-10">
                  <p className="text-lg text-black mb-4">
                    Cada oportunidad pasa por estos 6 filtros antes de presentarse a
                    inversionistas.
                  </p>
                 
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-5xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">¿Para quién es?</h2>
              <p className="text-xl text-muted-foreground">
                Perfil Inversión vs Perfil Patrimonial
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-bold">Perfil Inversión</h3>
                </div>
                <ul className="space-y-4">
                  {idealProfile.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-destructive" />
                  <h3 className="text-2xl font-bold">Perfil Patrimonial</h3>
                </div>
                <ul className="space-y-4">
                  {notIdealProfile.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-primary/5 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg font-mono text-primary">
              Pago de contado • Proceso legal • Certeza juridica
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para descubrir si los remates son para ti?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Solicita una asesoria personalizada y uno de nuestros asesores se comunicará contigo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to={ROUTE_PATHS.DIAGNOSIS}>
                  Asesoria personalizada
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link to={ROUTE_PATHS.OPPORTUNITIES}>Ver Oportunidades</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
