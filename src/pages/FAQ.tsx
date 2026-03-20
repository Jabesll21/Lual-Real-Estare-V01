import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faqCategories } from '@/data/faq';
import { ROUTE_PATHS, getWhatsAppLink } from '@/lib/index';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;

    const query = searchQuery.toLowerCase();
    return faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const totalResults = useMemo(
    () => filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0),
    [filteredCategories]
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileQuestion className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Preguntas frecuentes
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Respuestas claras a las dudas más comunes sobre remates bancarios e
              inversión inmobiliaria
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-base bg-card border-border shadow-sm"
              />
            </div>

            {searchQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado
                {totalResults !== 1 ? 's' : ''}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Tabs
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-muted/50 mb-12">
                {filteredCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="text-sm py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {filteredCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.items.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="bg-card border border-border rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <AccordionTrigger className="text-left py-6 hover:no-underline">
                            <span className="text-base font-semibold pr-4">
                              {item.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6 pt-2">
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>

            {filteredCategories.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FileQuestion className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  No se encontraron resultados
                </p>
                <p className="text-sm text-muted-foreground">
                  Intenta con otros términos de búsqueda
                </p>
              </motion.div>
            )}
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
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nuestro equipo está disponible para resolver cualquier duda específica
              sobre tu caso de inversión
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 text-base"
                onClick={() =>
                  window.open(
                    getWhatsAppLink(
                      'Hola, tengo una pregunta sobre remates bancarios que no encontré en el FAQ'
                    ),
                    '_blank'
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar por WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base"
                asChild
              >
                <Link to={ROUTE_PATHS.DIAGNOSIS}>Solicitar diagnóstico gratuito</Link>
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground font-mono">
              Tiempo de respuesta: 24-48 horas • Diagnóstico sin compromiso
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}