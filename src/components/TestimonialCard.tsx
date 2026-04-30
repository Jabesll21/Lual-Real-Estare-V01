import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  testimonial: {
    name: string;
    profile: string;
    city: string;
    text: string;
    rating: number;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
    >
      <div className="absolute top-6 left-6 text-primary/10">
        <Quote className="w-12 h-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "fill-accent text-accent"
                  : "text-muted"
              }`}
            />
          ))}
        </div>

        <blockquote className="font-serif text-lg leading-relaxed text-foreground mb-6">
          {testimonial.text}
        </blockquote>

        <div className="flex items-start justify-between gap-4 pt-6 border-t border-border">
          <div>
            <p className="font-semibold text-foreground mb-1">
              {testimonial.name}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              {testimonial.profile}
            </p>
            <p className="text-sm text-muted-foreground">{testimonial.city}</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
