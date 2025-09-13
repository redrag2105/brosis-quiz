import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, BookOpen, Star, Sparkles, Zap } from "lucide-react";
import { ROUTES } from "../constants";

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-amber-400" />,
      title: "20 Câu hỏi",
      description: "Thử thách kiến thức PCCC, lừa đảo mạng và sơ cấp cứu",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Đồng đội",
      description: "Cùng team vượt thử thách DIGISURVIVE",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Xếp hạng",
      description: "Chinh phục thử thách, ghi dấu trên bảng vàng",
      color: "from-yellow-500/20 to-orange-500/20",
    },
  ];

  const floatingElements = [
    { icon: <Star className="w-4 h-4" />, delay: 0, color: "text-cyan-400" },
    {
      icon: <Sparkles className="w-3 h-3" />,
      delay: 1,
      color: "text-purple-400",
    },
    { icon: <Zap className="w-4 h-4" />, delay: 2, color: "text-yellow-400" },
    { icon: <Star className="w-3 h-3" />, delay: 3, color: "text-pink-400" },
    {
      icon: <Sparkles className="w-4 h-4" />,
      delay: 4,
      color: "text-blue-400",
    },
    { icon: <Star className="w-3 h-3" />, delay: 0.5, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${
                ["cyan", "purple", "yellow", "pink", "blue"][i]
              }40 0%, transparent 70%)`,
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${10 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              x: [-20, 20, -20],
              y: [-10, 10, -10],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Small floating icons */}
        {floatingElements.map((element, i) => (
          <motion.div
            key={`float-${i}`}
            className={`absolute ${element.color}`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
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
            {element.icon}
          </motion.div>
        ))}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 pt-4 max-w-lg w-full text-center relative overflow-hidden"
        >
          {/* Card background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-yellow-500/5 rounded-3xl"></div>

          {/* Header with Icon */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8 relative z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-45 h-45 flex items-center justify-center mx-auto mb-2 relative"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="w-42 h-42 object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3"
            >
              Vua Sinh Tồn
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-lg"
            >
              Trải nghiệm sinh tồn dành cho Tân sinh viên K21
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8 cursor-default"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className={`bg-gradient-to-br ${feature.color} border border-slate-600/50 rounded-xl p-4 text-center backdrop-blur-sm hover:border-slate-500/70 transition-all duration-300`}
              >
                <motion.div
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-2"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="font-semibold text-white text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
          >
            <p className="text-cyan-100 text-sm">
              <span className="text-2xl mr-2">🧠</span>
              <strong>Sinh tồn thời đại số:</strong> Hành trình rèn luyện kỹ
              năng thiết yếu để thích nghi và vững vàng trong mọi tình huống
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-4"
          >
            <Link to={ROUTES.LEADERBOARD}>
              <motion.button
                whileHover={{
                  scale: 1.01,
                  y: -1,
                  transition: { duration: 0.4 },
                  boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer mb-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>🏆</span>
                  <span>Bảng Xếp Hạng</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-6 pt-6 border-t border-slate-700/50"
          >
            <p className="text-slate-500 text-xs">
              Phoenix's House - Brothers&Sisters 2025
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
