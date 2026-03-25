import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Opportunities from "@/pages/Opportunities";
import CDMX from "@/pages/CDMX";
import Diagnosis from "@/pages/Diagnosis";
import FAQ from "@/pages/FAQ";
import Results from "@/pages/Results";
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProperties from "@/pages/admin/Properties";
import AdminForms from "@/pages/admin/Forms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <HashRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/como-funciona" element={<Layout><HowItWorks /></Layout>} />
              <Route path="/oportunidades" element={<Layout><Opportunities /></Layout>} />
              <Route path="/cdmx" element={<Layout><CDMX /></Layout>} />
              <Route path="/diagnostico" element={<Layout><Diagnosis /></Layout>} />
              <Route path="/preguntas-frecuentes" element={<Layout><FAQ /></Layout>} />
              <Route path="/resultados" element={<Layout><Results /></Layout>} />

              {/* Rutas de administración */}
            <Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
<Route path="/admin/propiedades" element={
  <ProtectedRoute><AdminProperties /></ProtectedRoute>
} />
<Route path="/admin/formularios" element={
  <ProtectedRoute><AdminForms /></ProtectedRoute>
} />
            </Routes>
            <WhatsAppButton />
          </HashRouter>
        </MotionConfig>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;