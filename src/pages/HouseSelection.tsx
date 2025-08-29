import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Castle, Star } from "lucide-react";
import { useAppContext } from "../context/hooks";
import { HOUSE_OPTIONS, ROUTES } from "../constants";
import { Button } from "../components/ui/button";
import { HouseIcon } from "../components/ui/house-icon";
import { HouseModelScene, ThreeErrorBoundary } from "../components/three";
import type { House } from "../types";

export default function HouseSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [selectedHouse, setSelectedHouse] = useState<House | "">("");
  const [hoveredHouse, setHoveredHouse] = useState<House | null>(null);

  useEffect(() => {
    if (!state.studentInfo) {
      navigate(ROUTES.REGISTRATION);
      return;
    }
  }, [state.studentInfo, navigate]);

  const handleHouseSelect = (houseValue: House) => {
    setSelectedHouse(houseValue);
  };

  const handleSubmit = () => {
    if (selectedHouse && state.studentInfo) {
      dispatch({
        type: "SET_STUDENT_INFO",
        payload: { ...state.studentInfo, nha: selectedHouse },
      });
      navigate(ROUTES.QUIZ);
    }
  };

  const floatingElements = [...Array(10)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.4 + Math.random() * 0.6,
    delay: Math.random() * 3,
  }));

  if (!state.studentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`house-orb-${i}`}
            className="absolute rounded-full opacity-8"
            style={{
              background: `radial-gradient(circle, ${
                ["amber", "orange", "yellow", "red"][i]
              }60 0%, transparent 70%)`,
              width: `${350 + i * 120}px`,
              height: `${350 + i * 120}px`,
              left: `${-30 + i * 25}%`,
              top: `${-30 + i * 20}%`,
            }}
            animate={{
              x: [-40, 40, -40],
              y: [-30, 30, -30],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating magical elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-amber-400/40"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              scale: element.scale,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          >
            {element.id % 3 === 0 ? (
              <Sparkles className="w-4 h-4" />
            ) : element.id % 3 === 1 ? (
              <Star className="w-3 h-3" />
            ) : (
              <Castle className="w-5 h-5" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Three.js Scene */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="bg-slate-800/40 h-[540px] backdrop-blur-xl rounded-3xl p-1 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute  inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl"></div>

            <div className="relative z-10">
              <ThreeErrorBoundary>
                <HouseModelScene
                  selectedHouse={selectedHouse}
                  onHouseSelect={handleHouseSelect}
                />
              </ThreeErrorBoundary>
            </div>
          </div>
        </motion.div>

        {/* House Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {HOUSE_OPTIONS.map((house, index) => {
              const isSelected = selectedHouse === house.value;
              const isHovered = hoveredHouse === house.value;

              return (
                <motion.div
                  key={house.value}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="relative"
                >
                  <motion.button
                    type="button"
                    onClick={() => handleHouseSelect(house.value)}
                    onMouseEnter={() => setHoveredHouse(house.value)}
                    onMouseLeave={() => setHoveredHouse(null)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden group ${
                      isSelected
                        ? `${house.borderColor} ${house.bgColor} border-opacity-80 shadow-lg shadow-current/20`
                        : "border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 hover:border-slate-500"
                    } ${
                      house.value === "phoenix"
                        ? "ring-2 ring-amber-500/30"
                        : ""
                    }`}
                  >
                    {/* Background glow effect */}
                    {(isSelected || isHovered) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute inset-0 bg-gradient-to-br ${house.color} opacity-15 rounded-2xl`}
                      />
                    )}

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <HouseIcon
                        svgIcon={house.svgIcon}
                        fallbackIcon={house.icon}
                        alt={`${house.label} house icon`}
                        isSelected={isSelected}
                        animate={true}
                      />

                      <h3
                        className={`font-bold text-xl mb-3 ${
                          isSelected ? house.textColor : "text-white"
                        }`}
                      >
                        {house.label}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed ${
                          isSelected ? house.textColor : "text-slate-400"
                        } opacity-90`}
                      >
                        {house.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hover effect border */}
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 border-2 border-amber-500/50 rounded-2xl"
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate(ROUTES.REGISTRATION)}
              variant="outline"
              className="flex items-center space-x-2 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!selectedHouse}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50 px-6 py-3 relative overflow-hidden group"
            >
              <span>🚀 Bắt đầu làm bài thi</span>
              <ArrowRight className="w-4 h-4" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
