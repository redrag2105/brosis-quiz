import { useState } from "react";
import { motion } from "framer-motion";

interface HouseIconProps {
  svgIcon?: string;
  fallbackIcon: string;
  alt: string;
  className?: string;
  isSelected?: boolean;
  animate?: boolean;
}

export function HouseIcon({ 
  svgIcon, 
  fallbackIcon, 
  alt, 
  className = "", 
  isSelected = false,
  animate = true 
}: HouseIconProps) {
  const [svgError, setSvgError] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // If no SVG provided or SVG failed to load, use emoji fallback
  if (!svgIcon || svgError) {
    return (
      <motion.div
        animate={
          animate && isSelected
            ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }
            : animate
            ? { rotate: [0, 5, -5, 0] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        className={`text-5xl mb-4 ${className}`}
      >
        {fallbackIcon}
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={
        animate && isSelected
          ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }
          : animate
          ? { rotate: [0, 5, -5, 0] }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      className={`mb-4 flex justify-center items-center ${className}`}
    >
      {/* SVG Image */}
      <img
        src={svgIcon}
        alt={alt}
        className={`w-16 h-16 object-contain transition-opacity duration-300 ${
          svgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setSvgLoaded(true)}
        onError={() => {
          setSvgError(true);
          setSvgLoaded(false);
        }}
      />
      
      {/* Loading/Fallback indicator */}
      {!svgLoaded && !svgError && (
        <div className="w-16 h-16 flex items-center justify-center">
          <div className="text-3xl opacity-50">{fallbackIcon}</div>
        </div>
      )}
    </motion.div>
  );
}
