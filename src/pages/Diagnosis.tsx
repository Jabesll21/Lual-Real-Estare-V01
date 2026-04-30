import { motion } from "framer-motion";
import { CheckCircle2, Shield, Clock, Target, FileCheck } from "lucide-react";
import { DiagnosisForm } from "@/components/DiagnosisForm";
import { TestimonialCard } from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function Diagnosis() {
  const diagnosisTestimonials = testimonials.filter(
    (t) => t.id === "7" || t.id === "1"
  );

  const benefits = [
    {
      icon: Target,
      title: "Análisis de perfil personalizado",
      description:
        "Evaluamos tu situación financiera, experiencia y objetivos para determinar si los remates son la mejor opción para ti.",
    },
    {
      icon: FileCheck,
      title: "Recomendación de tipo de remate",
      description:
        "Te orientamos sobre qué etapa legal se ajusta mejor a tu perfil.",
    },
    {
      icon: CheckCircle2,
      title: "Oportunidades que coincidan",
      description:
        "Te presentamos propiedades verificadas que se ajusten a tu presupuesto y ciudad de interés.",
    },
    {
      icon: Clock,
      title: "Siguiente paso claro",
      description:
        "Te explicamos exactamente qué sigue: documentación necesaria, tiempos estimados, y cómo opera el acompañamiento de LUAL.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Descubre si los remates son para ti
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Asesoria personalizada sin compromiso.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
              <DiagnosisForm />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Qué incluye la asesoria personalizada
            </h2>
            <p className="text-lg text-muted-foreground">
              Un análisis completo para determinar la mejor opcion para ti.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Inversionistas que empezaron aquí
            </h2>
            <p className="text-lg text-muted-foreground">
              Casos reales de personas que solicitaron su asesoria personalizada y hoy son
              propietarios.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {diagnosisTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Garantía de privacidad
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
               No compartimos tu información con terceros. Solo usamos tu información para contactarte sobre oportunidades de
                inversión en remates bancarios. Puedes solicitar la eliminación de
                tus datos en cualquier momento.
              </p>
              
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
           
            <p className="text-base text-foreground font-medium">
              Pago de contado • Proceso legal • Certeza juridica
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
