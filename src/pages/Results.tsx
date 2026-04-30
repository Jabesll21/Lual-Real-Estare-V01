import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, MapPin, Home, DollarSign } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { TestimonialCard } from '@/components/TestimonialCard';
import { ROUTE_PATHS } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import { Button } from '@/components/ui/button';

const caseStudies = [
  {
    id: '1',
    propertyImage: IMAGES.PROPERTY_INTERIOR_2,
    propertyType: 'Departamento',
    location: 'Zona Río, Tijuana',
    initialInvestment: '$2,800,000',
    commercialValue: '$4,300,000',
    savings: '$1,500,000',
    savingsPercent: '35%',
    timeframe: '14 meses',
    investorName: 'Carlos Mendoza',
    investorProfile: 'principiante',
    testimonial: 'Llevaba años ahorrando sin saber cómo invertir. LUAL me explicó todo el proceso de remates con claridad y me acompañó en cada etapa legal.',
  },
  {
    id: '2',
    propertyImage: IMAGES.PROPERTY_INTERIOR_4,
    propertyType: 'Casa',
    location: 'Coyoacán, CDMX',
    initialInvestment: '$4,200,000',
    commercialValue: '$7,000,000',
    savings: '$2,800,000',
    savingsPercent: '40%',
    timeframe: '18 meses',
    investorName: 'Ana Patricia Ruiz',
    investorProfile: 'empresario',
    testimonial: 'Como empresaria, necesitaba una inversión segura y con retorno claro. El análisis legal fue exhaustivo y transparente.',
  },
  {
    id: '3',
    propertyImage: IMAGES.PROPERTY_INTERIOR_5,
    propertyType: 'Local Comercial',
    location: 'Playas de Tijuana',
    initialInvestment: '$3,500,000',
    commercialValue: '$4,850,000',
    savings: '$1,350,000',
    savingsPercent: '28%',
    timeframe: '11 meses',
    investorName: 'Roberto Sánchez',
    investorProfile: 'intermedio',
    testimonial: 'Ya había comprado propiedades tradicionales, pero los remates eran territorio desconocido. LUAL desmitificó el proceso.',
  },
];

const insights = [
  {
    title: 'Los tiempos son variables',
    description: 'El proceso legal de un remate puede tomar entre 8 y 24 meses. No hay atajos. La paciencia es parte de la inversión.',
  },
  {
    title: 'El análisis legal es no negociable',
    description: 'Cada propiedad requiere due diligence exhaustivo. Saltarse este paso puede convertir un descuento en una pérdida.',
  },
  {
    title: 'El capital de contado es requisito',
    description: 'Los remates no admiten financiamiento bancario tradicional. Si no tienes liquidez, este modelo no es para ti.',
  },
  {
    title: 'El acompañamiento marca la diferencia',
    description: 'Navegar el proceso legal sin experiencia es arriesgado. Un equipo especializado reduce riesgos y acelera tiempos.',
  },
];

export default function Results() {
  const filteredCases = caseStudies;
  const filteredTestimonials = testimonials;

  return (
    <div className="min-h-screen">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Resultados reales de inversionistas como tú
            </h1>
            <p className="text-xl text-muted-foreground">
              Casos verificados. Sin promesas infladas.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {filteredCases.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={caseStudy.propertyImage}
                      alt={caseStudy.propertyType}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full text-sm font-medium">
                        <Home className="w-4 h-4" />
                        {caseStudy.propertyType}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{caseStudy.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Inversión inicial</p>
                        <p className="text-2xl font-mono font-semibold">{caseStudy.initialInvestment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Valor comercial</p>
                        <p className="text-2xl font-mono font-semibold">{caseStudy.commercialValue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Ahorro obtenido</p>
                        <p className="text-2xl font-mono font-semibold text-accent">
                          {caseStudy.savings}
                        </p>
                        <p className="text-sm text-accent font-medium">{caseStudy.savingsPercent} descuento</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo del proceso</p>
                        <p className="text-2xl font-mono font-semibold flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          {caseStudy.timeframe}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <p className="text-sm font-medium mb-2">{caseStudy.investorName}</p>
                      <p className="text-sm text-muted-foreground capitalize mb-3">
                        Inversionista {caseStudy.investorProfile}
                      </p>
                      <p className="text-foreground/80 leading-relaxed italic">
                        "{caseStudy.testimonial}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center">
              Más testimonios verificados
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              Experiencias reales de inversionistas que confiaron en LUAL
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              ¿Listo para tu caso de éxito?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Descubre si los remates bancarios son para ti con una asesoria personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to={ROUTE_PATHS.DIAGNOSIS}>
                  Solicitar asesoria personalizada
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to={ROUTE_PATHS.OPPORTUNITIES}>
                  <DollarSign className="mr-2 w-5 h-5" />
                  Ver oportunidades disponibles
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground font-mono">
            Pago de contado • Proceso legal • Certeza juridica
          </p>
        </div>
      </section>
    </div>
  );
}
