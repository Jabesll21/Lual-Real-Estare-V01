import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, TrendingUp, Users, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '@/components/PropertyCard';
import { faqCategories } from '@/data/faq';
import { getWhatsAppLink, Property, ROUTE_PATHS } from '@/lib/index';
import { getPropertiesByCity } from '@/api/properties';
import { IMAGES } from '@/assets/images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const cdmxFAQ = [
  {
    question: '¿Por qué LUAL decidió expandirse a CDMX?',
    answer:
      'Ciudad de México representa el mercado inmobiliario más grande y dinámico de México, con alta demanda de inversión patrimonial. Después de 15 años de éxito en Tijuana, expandimos operaciones a CDMX para ofrecer oportunidades de inversión en zonas premium como Polanco, Condesa, Coyoacán, y Santa Fe. Contamos con equipo legal y operativo local que garantiza el mismo nivel de acompañamiento.',
  },
  {
    question: '¿El proceso de remate es diferente en CDMX que en Tijuana?',
    answer:
      'El marco legal es el mismo (Código de Comercio federal), pero los tiempos pueden variar por la carga de trabajo de los juzgados en CDMX. En general, los procesos en CDMX toman entre 10-24 meses. LUAL tiene experiencia en ambas plazas y adapta la estrategia según las particularidades de cada juzgado y entidad bancaria.',
  },
  {
    question: '¿Puedo invertir en CDMX si vivo en otra ciudad?',
    answer:
      'Sí. Muchos de nuestros inversionistas en CDMX viven en otras ciudades o en el extranjero. LUAL coordina inspecciones, trámites, y seguimiento remoto. Solo requieres presencia física para firmas notariales críticas (adjudicación y escrituración). Proporcionamos reportes detallados, videollamadas de inspección, y actualizaciones constantes.',
  },
  {
    question: '¿Qué zonas de CDMX tienen más oportunidades de remate?',
    answer:
      'Las zonas con mayor inventario de remates son: Benito Juárez (Del Valle, Narvarte), Coyoacán, Cuauhtémoc (Condesa, Roma), Miguel Hidalgo (Polanco, Anzures), y Álvaro Obregón (Santa Fe). Estas zonas combinan alta plusvalía, demanda de renta, y liquidez en reventa. LUAL filtra oportunidades según tu perfil de inversión y zona de interés.',
  },
  {
    question: '¿El equipo de LUAL en CDMX tiene experiencia local?',
    answer:
      'Sí. Nuestro equipo en CDMX está conformado por abogados especializados en derecho inmobiliario y procesal, con experiencia en juzgados locales. Contamos con red de notarios, peritos valuadores, y contactos institucionales en bancos y autoridades. Combinamos la experiencia de 15 años de LUAL con conocimiento profundo del mercado capitalino.',
  },
];

const opportunityZones = [
  {
    name: 'Polanco',
    description: 'Zona premium con alta plusvalía y demanda corporativa',
    icon: Building2,
  },
  {
    name: 'Condesa / Roma',
    description: 'Alta demanda de renta corto plazo, zona cultural y gastronómica',
    icon: TrendingUp,
  },
  {
    name: 'Coyoacán',
    description: 'Zona histórica con arquitectura colonial, alta plusvalía',
    icon: MapPin,
  },
  {
    name: 'Benito Juárez',
    description: 'Zona consolidada, excelente conectividad, demanda familiar',
    icon: Building2,
  },
  {
    name: 'Santa Fe',
    description: 'Corredor corporativo, alta demanda de oficinas y residencial',
    icon: TrendingUp,
  },
  {
    name: 'Cuauhtémoc',
    description: 'Centro financiero y cultural, alta liquidez en reventa',
    icon: MapPin,
  },
];

const teamMembers = [
  {
    name: 'Lic. María Fernández',
    role: 'Directora Legal CDMX',
    description: '12 años en derecho inmobiliario y procesal',
  },
  {
    name: 'Arq. Carlos Mendoza',
    role: 'Análisis Técnico',
    description: 'Especialista en valuación y due diligence',
  },
  {
    name: 'Lic. Ana Gutiérrez',
    role: 'Gestión de Operaciones',
    description: 'Coordinación de trámites y seguimiento judicial',
  },
];

const staticMarketData = [
  {
    label: 'Descuento promedio',
    value: '30%',
    description: 'Sobre valor comercial',
  },
  {
    label: 'Tiempo promedio',
    value: '6-24 meses',
    description: 'Desde selección hasta escrituración',
  },
];

export default function CDMX() {
  const [cdmxProperties, setCdmxProperties] = useState<Property[]>([]);

  useEffect(() => {
    let mounted = true;
    getPropertiesByCity('CDMX').then((data) => {
      if (mounted) setCdmxProperties(data);
    });
    return () => { mounted = false; };
  }, []);

  const marketData = [
    {
      label: 'Oportunidades activas',
      value: cdmxProperties.length > 0 ? String(cdmxProperties.length) : '—',
      description: 'Inmuebles verificados en proceso',
    },
    ...staticMarketData,
  ];

  const whatsappMessage =
    'Hola, me interesa conocer más sobre las oportunidades de inversión en remates bancarios en CDMX. ¿Podrían proporcionarme información?';
  const whatsappLink = getWhatsAppLink(whatsappMessage, '525666888089');

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.HERO_PROPERTY_5}
            alt="CDMX Real Estate"
            className="w-full h-full object-cover opacity-30"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
          

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              LUAL en Ciudad de México
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Llevamos 15 años de experiencia en remates bancarios al mercado más dinámico de
              México. Presencia real, equipo local, oportunidades verificadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg">
                <a href="#oportunidades">Ver oportunidades CDMX</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Contactar equipo CDMX
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">El mercado CDMX</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ciudad de México concentra el mayor inventario de remates bancarios en México, con
              oportunidades en zonas de alta plusvalía y demanda constante.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {marketData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card p-6 rounded-xl border border-border shadow-sm"
              >
                <div className="text-4xl font-bold text-primary mb-2">{item.value}</div>
                <div className="text-lg font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </motion.div>
            ))}
          </div>

          
        </div>
      </section>

      <section id="oportunidades" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Oportunidades activas en CDMX</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Inmuebles verificados en entrega inmediata, dación en pago y adjudicación.
            </p>
          </motion.div>

          {(() => {
            const featured = cdmxProperties
              .filter((p) => p.legalStage === 'entrega_inmediata' || p.legalStage === 'dacion_pagos' || p.legalStage === 'adjudicacion')
              .slice(0, 3);
            return featured.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featured.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-6">
                  Actualmente estamos actualizando el inventario de CDMX.
                </p>
                <Button asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Solicitar oportunidades disponibles
                  </a>
                </Button>
              </div>
            );
          })()}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-4 mb-12"
          >
            <Button size="lg" asChild>
              <Link to={`${ROUTE_PATHS.OPPORTUNITIES}?city=CDMX`}>
                Ver todas las oportunidades en CDMX
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-muted/50 border border-border rounded-xl p-8 text-center"
          >
            <p className="text-lg text-muted-foreground mb-4">
              ¿No encuentras lo que buscas en CDMX?
            </p>
            <Button size="lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Solicitar una Asesoria Personalizada
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-xl p-8"
          >
            <div className="flex items-start gap-4 mb-6">
              <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Presencia real en CDMX</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestro equipo en Ciudad de México opera desde oficinas físicas, con alianzas en
                  juzgados, bancos, y notarías. No somos un portal remoto: somos una firma local con
                  inventario nacional.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm">Oficina física en CDMX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm">Red de notarios locales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm">Contactos institucionales</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Preguntas frecuentes CDMX</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Respuestas específicas sobre nuestra operación en Ciudad de México.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {cdmxFAQ.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold pr-4">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para invertir en CDMX?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Contacta a nuestro equipo en Ciudad de México. Te proporcionamos asesoria personalizada
              y oportunidades verificadas según tu perfil de inversión.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Contactar vía WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <a href="#oportunidades">Ver oportunidades</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground font-mono">
              Pago de contado • Proceso legal • Certeza jurídica
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
