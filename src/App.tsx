import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Opportunities from "@/pages/Opportunities";
import CDMX from "@/pages/CDMX";
import Diagnosis from "@/pages/Diagnosis";
import FAQ from "@/pages/FAQ";
import Results from "@/pages/Results";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/oportunidades" element={<Opportunities />} />
              <Route path="/cdmx" element={<CDMX />} />
              <Route path="/diagnostico" element={<Diagnosis />} />
              <Route path="/preguntas-frecuentes" element={<FAQ />} />
              <Route path="/resultados" element={<Results />} />
            </Routes>
          </Layout>
          <WhatsAppButton />
        </HashRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;