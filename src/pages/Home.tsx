import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Shield, FileCheck, TrendingUp, Users, Award, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PropertyCard } from '@/components/PropertyCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { ROUTE_PATHS, formatPrice } from '@/lib/index';
import { useEffect, useState } from 'react';
import { getHighlightedProperties } from '@/api/properties';
import { faqCategories } from '@/data/faq';
import { testimonials } from '@/data/testimonials';
import { IMAGES } from '@/assets/images';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [carouselPaused, setCarouselPaused] = useState(false)

  const ITEMS_PER_PAGE = 3
  const totalPages = Math.ceil(featuredProperties.length / ITEMS_PER_PAGE)

  useEffect(() => {
    let mounted = true
    getHighlightedProperties().then(data => {
      if (mounted) setFeaturedProperties(data)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (carouselPaused || totalPages <= 1) return
    const t = setInterval(() => {
      setSlideDir(1)
      setCurrentPage(p => (p + 1) % totalPages)
    }, 6000)
    return () => clearInterval(t)
  }, [carouselPaused, totalPages])
  const quickFAQ = faqCategories[0].items.slice(0, 5);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.HERO_PROPERTY_7}
            alt="Propiedad premium"
            className="w-full h-full object-cover opacity-30"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight"
              variants={fadeInUp}
              style={{ fontFamily: '' }}
            >
              Invierte en inmuebles con descuento real.
              <br />
              <span className="text-primary">Sin crédito. Con acompañamiento legal.</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Remates bancarios verificados en Tijuana y CDMX. Descuentos del 20% al 40%.
              Proceso transparente. Acompañamiento en cada etapa.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to={ROUTE_PATHS.OPPORTUNITIES}>
                  Ver oportunidades
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to={ROUTE_PATHS.DIAGNOSIS}>
                  Asesoria Personalizada
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="pt-8 text-sm text-muted-foreground font-mono"
              variants={fadeInUp}
            >
              Pago de contado • Proceso legal • Certeza judiridica
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: TrendingUp, value: '850+', label: 'Operaciones exitosas' },
              { icon: Award, value: '$350M+', label: 'Valor transaccional' },
              { icon: Users, value: '15+', label: 'Años de experiencia' },
              { icon: CheckCircle2, value: '99%', label: 'Satisfacción' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center space-y-2"
                variants={fadeInUp}
              >
                <stat.icon className="h-12 w-12 mx-auto text-primary" />
                <div className="text-4xl font-bold" style={{ fontFamily: '' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '' }}>
                ¿Qué son los remates bancarios?
              </h2>
              <p className="text-xl text-muted-foreground">
                Oportunidades de inversión inmobiliaria con descuentos reales
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-8" variants={fadeInUp}>
              {[
                {
                  icon: Shield,
                  title: 'Proceso legal regulado',
                  description: 'Supervisado por autoridades judiciales. Transparente y verificable en cada etapa.'
                },
                {
                  icon: TrendingUp,
                  title: 'Descuentos del 20-40%',
                  description: 'Bancos buscan recuperar capital rápido, no maximizar ganancias inmobiliarias.'
                },
                {
                  icon: FileCheck,
                  title: 'Acompañamiento profesional',
                  description: 'Análisis jurídico y técnico, gestión de trámites hasta escrituración.'
                }
              ].map((item, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 space-y-4">
                    <item.icon className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '' }}>
                Oportunidades destacadas
              </h2>
              <p className="text-xl text-muted-foreground">
                Propiedades verificadas con descuentos reales
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div
                className="relative"
                onMouseEnter={() => setCarouselPaused(true)}
                onMouseLeave={() => setCarouselPaused(false)}
              >
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" custom={slideDir} initial={false}>
                    <motion.div
                      key={currentPage}
                      custom={slideDir}
                      variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="grid md:grid-cols-3 gap-8"
                    >
                      {featuredProperties
                        .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
                        .map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSlideDir(i > currentPage ? 1 : -1)
                          setCurrentPage(i)
                        }}
                        className={`transition-all duration-300 rounded-full h-2 ${
                          i === currentPage
                            ? 'bg-primary w-8'
                            : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/60'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <Button asChild size="lg">
                <Link to={ROUTE_PATHS.OPPORTUNITIES}>
                  Ver todas las oportunidades
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-5xl mx-auto space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '' }}>
                Cómo opera LUAL
              </h2>
              <p className="text-xl text-muted-foreground">
                Tu aliado estratégico en inversión inmobiliaria
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-8" variants={fadeInUp}>
              {[
                {
                  step: '1',
                  title: 'Filtrado riguroso',
                  description: 'Presentamos oportunidades que pasan validación legal, técnica, y financiera.'
                },
                {
                  step: '2',
                  title: 'Análisis legal profundo',
                  description: 'Verificamos expediente judicial, adeudos, documentación bancaria y margen de utilidad.'
                },
                {
                  step: '3',
                  title: 'Acompañamiento total',
                  description: 'Te guiamos desde la selección hasta la escrituración. Gestión de trámites, seguimiento judicial, y transparencia en cada etapa.'
                }
              ].map((item, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-5xl font-bold text-primary/20 font-mono">{item.step}</div>
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            <motion.div
              className="relative rounded-2xl overflow-hidden"
              variants={fadeInUp}
            >
              <img
                src={IMAGES.TRUST_BUSINESS_1}
                alt="Equipo LUAL"
                className="w-full h-64 object-cover opacity-40"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 px-4">
                  <p className="text-2xl font-semibold">
                    Más de 5 años acompañando inversionistas en México
                  </p>
                  <p className="text-muted-foreground">
                    850+ operaciones exitosas • $350M+ en valor transaccional
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
            className="space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '' }}>
                Resultados reales de inversionistas
              </h2>
              <p className="text-xl text-muted-foreground">
                Casos reales verificados.
              </p>
            </motion.div>

            <motion.div className="grid md:grid-cols-3 gap-8" variants={fadeInUp}>
              {featuredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <Button asChild size="lg" variant="outline">
                <Link to={ROUTE_PATHS.RESULTS}>
                  Ver más casos de éxito
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: '' }}>
                Preguntas frecuentes
              </h2>
              <p className="text-xl text-muted-foreground">
                Resolvemos tus dudas sobre remates bancarios
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Accordion type="single" collapsible className="space-y-4">
                {quickFAQ.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <Button asChild size="lg" variant="outline">
                <Link to={ROUTE_PATHS.FAQ}>
                  Ver todas las preguntas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold"
              style={{ fontFamily: '' }}
              variants={fadeInUp}
            >
              ¿Listo para tu primera inversión en remates?
            </motion.h2>

            <motion.p className="text-xl text-muted-foreground" variants={fadeInUp}>
              Agenda una cita con  uno de nuestros asesores y descubre si los remates bancarios son para ti.
              Sin compromiso. Con transparencia total.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to={ROUTE_PATHS.DIAGNOSIS}>
                  Solicitar Asesoria Personalizada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <a
                  href="https://wa.me/526641234567?text=Hola%2C%20quiero%20información%20sobre%20remates%20bancarios"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="pt-8 text-sm text-muted-foreground font-mono"
              variants={fadeInUp}
            >
              Pago de contado • Proceso legal • Certeza judiridica
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
