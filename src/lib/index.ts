export const ROUTE_PATHS = {
  HOME: '/',
  HOW_IT_WORKS: '/como-funciona',
  OPPORTUNITIES: '/oportunidades',
  CDMX: '/cdmx',
  DIAGNOSIS: '/diagnostico',
  FAQ: '/preguntas-frecuentes',
  RESULTS: '/resultados',
} as const;

export type LegalStage =
  | 'adjudicacion'
  | 'remate'
  | 'dacion'
  | 'preventa'
  | 'escrituracion'
  | 'etapa_inicial'
  | 'ejecucion_sentencia'
  | 'desahogo_pruebas'
  | 'emplazamiento'
  | 'entrega_inmediata'
  | 'dacion_pagos';

export const LEGAL_STAGES: Record<string, { label: string; color: string }> = {
  adjudicacion: {
    label: 'Adjudicación',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  remate: {
    label: 'Remate',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  dacion: {
    label: 'Dación en Pago',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  preventa: {
    label: 'Preventa',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  escrituracion: {
    label: 'Escrituración',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  etapa_inicial: {
    label: 'Etapa Inicial',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  ejecucion_sentencia: {
    label: 'Ejecución de Sentencia',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  desahogo_pruebas: {
    label: 'Desahogo de Pruebas',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  emplazamiento: {
    label: 'Emplazamiento',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  entrega_inmediata: {
    label: 'Entrega Inmediata',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
  dacion_pagos: {
    label: 'Dación en Pagos',
    color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
  },
}

export const INVESTMENT_RANGES = [
  { value: '500k-1m', label: '$500k - $1M MXN' },
  { value: '1m-2m', label: '$1M - $2M MXN' },
  { value: '2m-3m', label: '$2M - $3M MXN' },
  { value: '3m-5m', label: '$3M - $5M MXN' },
  { value: '5m+', label: 'Más de $5M MXN' },
] as const;

export interface Property {
  id: string;
  name: string;
  location: string;
  city: 'Tijuana' | 'CDMX';
  type: 'Casa' | 'Departamento' | 'Terreno' | 'Local Comercial' | 'Edificio';
  legalStage: LegalStage;
  commercialPrice: number
  auctionPrice: number;
  specs: {
    bedrooms?: number;
    bathrooms?: number;
    sqm: number;
    parking?: number;
  };
  images: string[];
  description: string;
  featured?: boolean;
}

export interface DiagnosisFormData {
  name: string;
  whatsapp: string;
  hasCapital: 'yes' | 'no' | 'not-sure';
  investmentRange: string;
  hasInvestedBefore: 'yes' | 'no';
  timeHorizon: '0-6' | '6-12' | '12-24' | '24+';
  cityInterest: 'tijuana' | 'cdmx' | 'both';
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDiscount(discount: number): string {
  return `${discount}% OFF`;
}

export function validateWhatsApp(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
}

export function getWhatsAppLink(message: string, phone: string = '526641234567'): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
