import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Home, Building2, Store, Landmark } from 'lucide-react';
import { Property, ROUTE_PATHS } from '@/lib/index';
import { getProperties } from '@/api/properties';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type CityFilter = 'all' | 'Tijuana' | 'CDMX';
type PropertyTypeFilter = 'all' | 'Casa' | 'Departamento' | 'Terreno' | 'Local Comercial';
type PriceRangeFilter = 'all' | '0-2m' | '2m-5m' | '5m-10m' | '10m+';

export default function Opportunities() {
  const [cityFilter, setCityFilter] = useState<CityFilter>('all');
  const [typeFilter, setTypeFilter] = useState<PropertyTypeFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceRangeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingProperties, setLoadingProperties] = useState(true)

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      setLoadingProperties(false)
    })
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (cityFilter !== 'all' && property.city !== cityFilter) return false;
      if (typeFilter !== 'all' && property.type !== typeFilter) return false;

      if (priceFilter !== 'all') {
        const price = property.auctionPrice;
        switch (priceFilter) {
          case '0-2m':
            if (price >= 2000000) return false;
            break;
          case '2m-5m':
            if (price < 2000000 || price >= 5000000) return false;
            break;
          case '5m-10m':
            if (price < 5000000 || price >= 10000000) return false;
            break;
          case '10m+':
            if (price < 10000000) return false;
            break;
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          property.name.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [properties, cityFilter, typeFilter, priceFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <MapPin className="w-3 h-3 mr-1" />
              Tijuana & CDMX
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Oportunidades de inversión{' '}
              <span className="text-primary">verificadas</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Propiedades en remate bancario con descuentos reales del 20-40%.
              Filtrado riguroso, análisis legal completo, acompañamiento profesional.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Pago de contado • Proceso legal • Tiempos variables
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por ubicación, nombre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Ciudad</label>
                <Tabs value={cityFilter} onValueChange={(v) => setCityFilter(v as CityFilter)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="Tijuana">Tijuana</TabsTrigger>
                    <TabsTrigger value="CDMX">CDMX</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Tipo de inmueble</label>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as PropertyTypeFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Casa">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Casa
                      </div>
                    </SelectItem>
                    <SelectItem value="Departamento">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Departamento
                      </div>
                    </SelectItem>
                    <SelectItem value="Terreno">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4" />
                        Terreno
                      </div>
                    </SelectItem>
                    <SelectItem value="Local Comercial">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Local Comercial
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Rango de precio</label>
                <Select value={priceFilter} onValueChange={(v) => setPriceFilter(v as PriceRangeFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los precios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    <SelectItem value="0-2m">Hasta $2M MXN</SelectItem>
                    <SelectItem value="2m-5m">$2M - $5M MXN</SelectItem>
                    <SelectItem value="5m-10m">$5M - $10M MXN</SelectItem>
                    <SelectItem value="10m+">Más de $10M MXN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loadingProperties ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando propiedades...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No se encontraron propiedades</h3>
              <p className="text-muted-foreground mb-6">
                Intenta ajustar los filtros o realiza una búsqueda diferente
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setCityFilter('all');
                  setTypeFilter('all');
                  setPriceFilter('all');
                  setSearchQuery('');
                }}
              >
                Limpiar filtros
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Disclaimer obligatorio
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Todas las propiedades requieren <strong>pago de contado</strong>. Los tiempos de
              escrituración son <strong>variables</strong> (4-24 meses) según etapa legal. Cada
              oportunidad pasa por <strong>análisis legal y técnico riguroso</strong> antes de
              presentarse. Los descuentos son reales respecto al valor comercial avaluado.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground mb-1">
                ¿No encuentras lo que buscas?
              </p>
              <p className="text-sm text-muted-foreground">
                Solicita un diagnóstico personalizado y te ayudamos a encontrar la oportunidad ideal
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to={ROUTE_PATHS.HOW_IT_WORKS}>Cómo funciona</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTE_PATHS.DIAGNOSIS}>Diagnóstico gratuito</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-24" />
    </div>
  );
}