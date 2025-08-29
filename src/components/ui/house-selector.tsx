import { motion } from "framer-motion";
import { useState } from "react";
import { HOUSE_OPTIONS } from "../../constants";

interface HouseSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function HouseSelector({
  value,
  onChange,
  error,
}: HouseSelectorProps) {
  const [hoveredHouse, setHoveredHouse] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-3">
      {HOUSE_OPTIONS.map((house, index) => {
        const isSelected = value === house.value;
        const isHovered = hoveredHouse === house.value;

        return (
          <motion.div
            key={house.value}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative"
          >
            <motion.button
              type="button"
              onClick={() => onChange(house.value)}
              onMouseEnter={() => setHoveredHouse(house.value)}
              onMouseLeave={() => setHoveredHouse(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full max-md:min-h-36 p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? `${house.borderColor} ${house.bgColor} border-opacity-80`
                  : error
                  ? "border-pink-500/50 bg-slate-700/30 hover:bg-slate-700/50"
                  : "border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 hover:border-slate-500"
              }`}
            >
              {/* Background glow effect */}
              {(isSelected || isHovered) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 bg-gradient-to-br ${house.color} opacity-10 rounded-xl`}
                />
              )}

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-2xl mb-2"
                >
                  {house.icon}
                </motion.div>

                <h3
                  className={`font-semibold text-sm mb-1 ${
                    isSelected ? house.textColor : "text-white"
                  }`}
                >
                  {house.label}
                </h3>

                <p
                  className={`text-xs md:whitespace-nowrap ${
                    isSelected ? house.textColor : "text-slate-400"
                  } opacity-80`}
                >
                  {house.description}
                </p>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}

              {/* Hover effect border */}
              {isHovered && !isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute inset-0 border-2 ${house.borderColor} rounded-xl opacity-50`}
                />
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
