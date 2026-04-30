export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "Sobre remates en general",
    items: [
      {
        question: "¿Qué es un remate bancario?",
        answer: "Un remate bancario es el proceso legal mediante el cual un banco recupera un inmueble que fue garantía de un crédito impagado. El banco vende los derechos a través de un proceso judicial para recuperar el capital prestado. Esto genera oportunidades de inversión con descuentos reales del 20% al 40% sobre el valor comercial."
      },
      {
        question: "¿Por qué hay descuentos en los remates?",
        answer: "Los bancos buscan recuperar capital rápidamente, no maximizar ganancias inmobiliarias. Además, las propiedades pueden requerir reparaciones menores o tener situaciones legales que el banco prefiere resolver vendiendo con descuento. El descuento compensa el tiempo del proceso legal y el riesgo asumido por el inversionista."
      },
      {
        question: "¿Es legal comprar en remate?",
        answer: "Sí, es completamente legal. Los remates bancarios están regulados por el Código de Comercio y la Ley de Instituciones de Crédito en México. Son procesos judiciales supervisados por autoridades competentes. LUAL verifica la legalidad de cada oportunidad antes de presentarla."
      },
      {
        question: "¿Puedo usar crédito bancario para comprar en remate?",
        answer: "No. Los remates bancarios requieren pago de contado. No aplica financiamiento bancario, crédito Infonavit, ni mensualidades. Esta es una inversión para personas con capital disponible o acceso a liquidez inmediata."
      }
    ]
  },
  {
    id: "process",
    title: "Sobre el proceso",
    items: [
      {
        question: "¿Cuánto tiempo toma el proceso completo?",
        answer: "El proceso varía entre 8 y 24 meses desde la selección de oportunidad hasta la escrituración final. Los tiempos dependen de: etapa legal actual del inmueble, carga de trabajo del juzgado, complejidad del caso, y trámites administrativos. LUAL te mantiene informado en cada etapa y gestiona todos los seguimientos."
      },
      {
        question: "¿Cuáles son las etapas del proceso?",
        answer: "1) Solicitud inicial y perfil de inversión. 2) Selección de oportunidad verificada. 3) Análisis legal y técnico profundo. 4) Preparación de oferta y documentación. 5) Participación en remate judicial. 6) Adjudicación y pago. 7) Escrituración y entrega física. LUAL te acompaña en todas las etapas con transparencia total."
      },
      {
        question: "¿Puedo visitar la propiedad antes de ofertar?",
        answer: "Depende de la etapa legal. En algunos casos sí es posible coordinar visitas con el banco o autoridad judicial. En otros casos solo se permite inspección exterior. LUAL siempre realiza inspección técnica previa y te proporciona reporte fotográfico detallado, análisis de estado físico, y estimación de costos de reparación si aplica."
      },
      {
        question: "¿Qué documentos necesito para participar?",
        answer: "Identificación oficial vigente, comprobante de domicilio reciente, RFC, CURP, estado de cuenta bancario que demuestre capacidad de pago, y carta de intención de compra. LUAL te guía en la preparación de toda la documentación requerida según la etapa del proceso."
      }
    ]
  },
  {
    id: "costs",
    title: "Sobre costos y tiempos",
    items: [
      {
        question: "¿Cuánto cobra LUAL por sus servicios?",
        answer: "LUAL cobra honorarios únicamente si la operación se concreta exitosamente (modelo de éxito compartido). No hay costos por solicitud inicial, análisis de oportunidades, o participación en remates no ganados. Los honorarios se definen claramente antes de iniciar el proceso y se pagan al momento de la escrituración."
      },
      {
        question: "¿Hay costos ocultos?",
        answer: "No. LUAL opera con transparencia total. Todos los costos se detallan por escrito antes de cualquier compromiso: precio de remate, gastos notariales, impuestos, honorarios LUAL, posibles adeudos, y estimación de reparaciones. Si surgen costos adicionales durante el proceso, se comunican inmediatamente con justificación."
      },
      {
        question: "¿Cuándo debo pagar el precio total del inmueble?",
        answer: "El pago se realiza en etapas: 1) Depósito en garantía al participar en remate (10-20%). 2) Pago del saldo restante una vez adjudicado el inmueble (plazo definido por el juzgado, típicamente 3-10 días). 3) Gastos notariales y honorarios al momento de escrituración. LUAL coordina todos los pagos con transparencia."
      },
      {
        question: "¿Puedo recuperar mi inversión rápidamente?",
        answer: "Los remates son inversiones de mediano a largo plazo. El proceso legal toma 8-24 meses. Una vez escriturado, puedes vender, rentar, o habitar el inmueble. La plusvalía se materializa al vender o rentar. No es una inversión líquida ni de corto plazo. LUAL te ayuda a definir estrategia de salida según tu horizonte de inversión."
      }
    ]
  },
  {
    id: "lual",
    title: "Sobre LUAL",
    items: [
      {
        question: "¿Qué hace LUAL exactamente?",
        answer: "LUAL es tu aliado estratégico en inversión inmobiliaria vía remates. Filtramos oportunidades, realizamos due diligence legal y técnico, te acompañamos en el proceso judicial, gestionamos trámites administrativos, y te asesoramos hasta la escrituración final. Operamos como firma de inversión patrimonial, no como portal de anuncios."
      },
      {
        question: "¿Por qué trabajar con LUAL y no directamente con el banco?",
        answer: "Los bancos publican inventarios pero no asesoran ni acompañan. LUAL aporta: 1) Filtrado riguroso de oportunidades reales. 2) Análisis legal profundo que evita riesgos. 3) Negociación estratégica. 4) Gestión de trámites complejos. 5) Acompañamiento en proceso judicial. 6) Red de contactos (notarios, peritos, abogados). Reducimos riesgo y tiempo de tu inversión."
      },
      {
        question: "¿Cuántos años de experiencia tiene LUAL?",
        answer: "LUAL tiene más de 15 años operando en el mercado de remates bancarios en México. Hemos acompañado más de 850 operaciones exitosas, con un valor transaccional superior a $350 millones de pesos. Nuestro equipo combina experiencia legal, financiera, e inmobiliaria."
      },
      {
        question: "¿En qué ciudades opera LUAL?",
        answer: "Actualmente operamos en Tijuana, Baja California (mercado principal) y Ciudad de México (expansión reciente). Estamos evaluando expansión a Guadalajara y Monterrey. Nuestro modelo de operación requiere presencia física, equipo legal local, y red de contactos institucionales en cada plaza."
      },
      {
        question: "¿Cómo garantiza LUAL la calidad de las oportunidades?",
        answer: "Aplicamos 7 filtros de due diligence: 1) Validación legal de expediente judicial. 2) Verificación de adeudos fiscales y servicios. 3) Inspección física del inmueble. 4) Análisis de mercado y valuación. 5) Revisión de documentación del banco. 6) Validación de viabilidad de escrituración. 7) Evaluación de riesgo-retorno. Solo presentamos oportunidades que pasan todos los filtros."
      }
    ]
  },
  {
    id: "requirements",
    title: "Sobre requisitos",
    items: [
      {
        question: "¿Quién puede invertir en remates?",
        answer: "Personas físicas o morales con: 1) Capital disponible para pago de contado (no crédito). 2) Horizonte de inversión de mediano plazo (12-36 meses). 3) Tolerancia al proceso legal y tiempos variables. 4) Capacidad de asumir costos adicionales (reparaciones, adeudos). 5) Interés en inversión patrimonial, no en casa para habitar inmediatamente."
      },
      {
        question: "¿Necesito experiencia previa en inversiones?",
        answer: "No. LUAL acompaña tanto a inversionistas principiantes como experimentados. Lo importante es: capital disponible, disposición a aprender el proceso, paciencia con tiempos legales, y confianza en el acompañamiento profesional. Proporcionamos educación continua y transparencia total en cada etapa."
      },
      {
        question: "¿Puedo comprar para habitar yo mismo?",
        answer: "Sí, pero debes entender que: 1) El proceso toma 8-24 meses (no es entrega inmediata). 2) Requiere pago de contado (no crédito). 3) Puede requerir reparaciones. 4) Hay incertidumbre en tiempos. Si buscas casa para habitar pronto y con financiamiento, los remates NO son la opción. Si tienes capital, paciencia, y visión de inversión, sí puede funcionar."
      },
      {
        question: "¿Qué pasa si no tengo todo el capital ahora?",
        answer: "Los remates requieren pago de contado al momento de adjudicación. Si no tienes el capital completo, considera: 1) Asociarte con inversionistas (LUAL puede facilitar). 2) Buscar financiamiento privado (no bancario). 3) Esperar hasta tener el capital. No recomendamos comprometerte sin liquidez asegurada, ya que perderías el depósito en garantía."
      },
      {
        question: "¿Puedo invertir si vivo fuera de México?",
        answer: "Sí, pero con consideraciones: 1) Debes tener RFC y cuenta bancaria en México. 2) Necesitas representante legal con poder notarial. 3) Algunos trámites requieren presencia física o firma ante notario mexicano. 4) LUAL puede coordinar todo remotamente, pero debes estar disponible para firmas críticas. Hemos trabajado exitosamente con inversionistas en EE.UU. y Canadá."
      }
    ]
  }
];