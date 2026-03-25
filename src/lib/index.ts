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
  | 'escrituracion';

export const LEGAL_STAGES: Record<LegalStage, { label: string; color: string }> = {
  adjudicacion: {
    label: 'SENTENCIA',
    color: 'bg-accent/10 text-accent border-accent/20',
  },
  remate: {
    label: 'Remate',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  dacion: {
    label: 'Dación en Pago',
    color: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
  },
  preventa: {
    label: 'Preventa',
    color: 'bg-muted text-muted-foreground border-border',
  },
  escrituracion: {
    label: 'Escrituración',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

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
  type: 'Casa' | 'Departamento' | 'Terreno' | 'Local Comercial';
  legalStage: LegalStage;
  commercialPrice: number;
  auctionPrice: number;
  discount: number;
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
