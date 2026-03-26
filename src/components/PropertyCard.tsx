import { useState } from 'react'
import { Property, formatPrice, formatDiscount, LEGAL_STAGES } from "@/lib/index";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PropertyInterestModal } from '@/components/PropertyInterestModal'

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const [showModal, setShowModal] = useState(false)
  const legalStageInfo = LEGAL_STAGES[property.legalStage] || {
    label: property.legalStage,
    color: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }

  const handleMoreInfo = () => {
    if (onClick) {
      onClick()
      return
    }
    setShowModal(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        whileHover={{ y: -8, transition: { type: "spring", stiffness: 400, damping: 30 } }}
      >
        <Card className="overflow-hidden border-border/50 shadow-[0_8px_30px_-6px_color-mix(in_srgb,var(--primary)_15%,transparent)] hover:shadow-[0_12px_40px_-8px_color-mix(in_srgb,var(--primary)_25%,transparent)] transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`${legalStageInfo.color} border font-mono text-xs px-3 py-1`}>
                {legalStageInfo.label}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Badge className="bg-red-600 text-white border-red-600 font-bold text-sm px-3 py-1.5 shadow-lg pointer-events-none">
                {formatDiscount(property.discount)}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-xs text-muted-foreground/70">{property.city}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground leading-tight">
                {property.name}
              </h3>

              <p className="text-sm text-muted-foreground">{property.type}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {property.specs.bedrooms && (
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4" />
                  <span>{property.specs.bedrooms}</span>
                </div>
              )}
              {property.specs.bathrooms && (
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4" />
                  <span>{property.specs.bathrooms}</span>
                </div>
              )}
              {property.specs.parking && (
                <div className="flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  <span>{property.specs.parking}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground line-through">
                  Precio comercial: {formatPrice(property.commercialPrice)}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(property.auctionPrice)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">MXN</p>
                </div>
                <p className="text-xs text-accent font-medium">
                  Ahorro de {formatPrice(property.commercialPrice - property.auctionPrice)}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Button
              onClick={handleMoreInfo}
              className="w-full gap-2 shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_35%,transparent)] hover:shadow-[0_6px_16px_color-mix(in_srgb,var(--primary)_45%,transparent)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            >
              <MessageCircle className="w-4 h-4" />
              Más información
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {showModal && (
        <PropertyInterestModal
          property={property}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}