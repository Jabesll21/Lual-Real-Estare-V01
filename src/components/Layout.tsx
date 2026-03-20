import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SiX, SiFacebook, SiInstagram, SiLinkedin } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/lib/index';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: ROUTE_PATHS.HOME, label: 'Inicio' },
    { to: ROUTE_PATHS.HOW_IT_WORKS, label: 'Cómo Funciona' },
    { to: ROUTE_PATHS.OPPORTUNITIES, label: 'Oportunidades' },
    { to: ROUTE_PATHS.CDMX, label: 'CDMX' },
    { to: ROUTE_PATHS.FAQ, label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to={ROUTE_PATHS.HOME} className="flex items-center">
              <img 
                src="/images/LOGO LUAL-01.png" 
                alt="LUAL Real Estate" 
                className="h-12 w-auto"
              />
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to={ROUTE_PATHS.DIAGNOSIS}>Diagnóstico Gratuito</Link>
              </Button>
              <Button asChild size="sm">
                <a
                  href="https://wa.me/526641234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20remates%20bancarios"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-border bg-background"
            >
              <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-medium transition-colors hover:text-primary ${
                        isActive ? 'text-primary' : 'text-foreground'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-4 space-y-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      to={ROUTE_PATHS.DIAGNOSIS}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Diagnóstico Gratuito
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <a
                      href="https://wa.me/526641234567?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20remates%20bancarios"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main style={{ paddingTop: `${headerHeight}px` }} className="flex-1">
        {children}
      </main>

      <footer className="bg-muted/30 border-t border-border mt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <img 
                src="/images/LOGO LUAL-01.png" 
                alt="LUAL Real Estate" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-sm text-muted-foreground mb-6">
                Inversión inmobiliaria en remates bancarios con acompañamiento legal
                profesional.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <SiInstagram size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin size={20} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Navegación
              </h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={ROUTE_PATHS.RESULTS}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Casos de Éxito
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Contacto
              </h3>
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground">
                  Tijuana, Baja California
                </li>
                <li className="text-sm text-muted-foreground">
                  Ciudad de México
                </li>
                <li>
                  <a
                    href="mailto:contacto@lual.mx"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    contacto@lual.mx
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+526641234567"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +52 (664) 123-4567
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Aviso de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Política de Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <p className="text-sm font-mono text-center text-muted-foreground">
                Pago de contado • Proceso legal • Tiempos variables
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2026 LUAL Real Estate. Todos los derechos reservados.
              </p>
              <p className="text-xs text-muted-foreground">
                Desarrollado con excelencia para inversionistas serios.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
