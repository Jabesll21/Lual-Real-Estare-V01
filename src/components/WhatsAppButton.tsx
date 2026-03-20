import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { useLocation } from "react-router-dom";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const location = useLocation();

  const getDefaultMessage = () => {
    const path = location.pathname;
    
    if (path.includes("oportunidades")) {
      return "Hola, me interesa conocer más sobre las oportunidades de inversión en remates bancarios disponibles.";
    }
    if (path.includes("como-funciona")) {
      return "Hola, me gustaría entender mejor cómo funciona el proceso de remates bancarios con LUAL.";
    }
    if (path.includes("cdmx")) {
      return "Hola, me interesa conocer las oportunidades de inversión en remates bancarios en Ciudad de México.";
    }
    if (path.includes("diagnostico")) {
      return "Hola, me gustaría solicitar un diagnóstico gratuito para evaluar si los remates bancarios son para mí.";
    }
    if (path.includes("resultados")) {
      return "Hola, vi los casos de éxito y me gustaría conocer más sobre cómo LUAL puede ayudarme a invertir en remates.";
    }
    if (path.includes("preguntas-frecuentes")) {
      return "Hola, tengo algunas preguntas sobre el proceso de remates bancarios que no encontré en el FAQ.";
    }
    
    return "Hola, me interesa conocer más sobre las oportunidades de inversión en remates bancarios con LUAL Real Estate.";
  };

  const handleClick = () => {
    const phoneNumber = "526641234567";
    const whatsappMessage = encodeURIComponent(message || getDefaultMessage());
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contactar por WhatsApp"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <SiWhatsapp className="h-7 w-7" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ zIndex: -1 }}
      />
    </motion.button>
  );
}