import { motion } from "framer-motion";
import {
  FileSearch,
  Home,
  ClipboardCheck,
  FileText,
  Gavel,
  CheckCircle2,
  Key,
} from "lucide-react";

interface TimelineStep {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  duration: string;
  responsible: "LUAL" | "Inversionista" | "Ambos";
}

const steps: TimelineStep[] = [
  {
    id: 1,
    icon: FileSearch,
    title: "Solicitud inicial",
    description:
      "Evaluamos tu perfil de inversión, capital disponible y objetivos. Definimos el tipo de oportunidad que buscas y tu horizonte temporal.",
    duration: "1-2 días",
    responsible: "LUAL",
  },
  {
    id: 2,
    icon: Home,
    title: "Selección de oportunidad",
    description:
      "Te presentamos propiedades que coinciden con tu perfil. Revisamos ubicación, precio, descuento real y potencial de la inversión.",
    duration: "2-4 semanas",
    responsible: "LUAL",
  },
  {
    id: 3,
    icon: ClipboardCheck,
    title: "Análisis legal y técnico",
    description:
      "Verificamos estatus legal, gravámenes, adeudos, condición física del inmueble. Validamos que la oportunidad sea real y segura.",
    duration: "3-6 semanas",
    responsible: "LUAL",
  },
  {
    id: 4,
    icon: FileText,
    title: "Preparación de oferta",
    description:
      "Estructuramos tu oferta con base en análisis de mercado. Preparamos documentación requerida y estrategia de participación.",
    duration: "1-2 semanas",
    responsible: "Ambos",
  },
  {
    id: 5,
    icon: Gavel,
    title: "Participación en remate",
    description:
      "Te acompañamos en el proceso de remate. Gestionamos la presentación de oferta y seguimiento con la institución bancaria.",
    duration: "Variable",
    responsible: "Ambos",
  },
  {
    id: 6,
    icon: CheckCircle2,
    title: "Adjudicación",
    description:
      "Una vez aceptada tu oferta, gestionamos el proceso de adjudicación. Validamos términos, condiciones y documentación oficial.",
    duration: "4-8 semanas",
    responsible: "LUAL",
  },
  {
    id: 7,
    icon: Key,
    title: "Escrituración y entrega",
    description:
      "Coordinamos el proceso de escrituración ante notario. Gestionamos la entrega física del inmueble y traspaso de propiedad.",
    duration: "8-16 semanas",
    responsible: "LUAL",
  },
];

const responsibleColors = {
  LUAL: "bg-primary/10 text-primary border-primary/20",
  Inversionista: "bg-accent/10 text-accent border-accent/20",
  Ambos: "bg-secondary/10 text-secondary-foreground border-secondary/20",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 35,
    },
  },
};

export function ProcessTimeline() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent" />

      <div className="space-y-12">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="relative flex gap-6"
            >
              <div className="relative z-10 flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 pb-12">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold">
                        {step.id}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {step.duration}
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                      responsibleColors[step.responsible]
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {step.responsible}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
