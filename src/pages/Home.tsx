import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  Users,
  BookOpen,
  Star,
  Sparkles,
  Zap,
} from "lucide-react";
import { ROUTES } from "../constants";

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
      title: "21 Câu hỏi",
      description: "Khám phá tính cách của bạn",
      color: "from-cyan-500/20 to-blue-500/20",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Cộng đồng",
      description: "Kết nối với bạn bè FPT",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Xếp hạng",
      description: "So tài với mọi người",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center relative overflow-hidden"
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
                rotate: [0, 360],
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-20 h-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <GraduationCap className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-3"
            >
              FPT Quiz Platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 text-lg"
            >
              Khám phá bản thân qua 21 câu hỏi thú vị
            </motion.p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.6 + index * 0.1,
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
                  whileHover={{ rotate: 360 }}
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
              <strong>Bắt đầu hành trình:</strong> Đăng ký thông tin và khám phá
              tính cách độc đáo của bạn qua 21 câu hỏi được thiết kế khoa học.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-4"
          >
            <Link to={ROUTES.REGISTRATION}>
              <motion.button
                whileHover={{
                  scale: 1.01,
                  y: -1,
                  transition: { duration: 0.4 },
                  boxShadow: "0 10px 30px rgba(6, 182, 212, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer mb-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Bắt đầu khám phá</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </motion.button>
            </Link>

            <Link to={ROUTES.LEADERBOARD}>
              <motion.button
                whileHover={{
                  scale: 1.01,
                  y: -1,
                  transition: { duration: 0.4 },
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer bg-slate-700/50 border-2 border-slate-600 hover:border-slate-500 text-slate-200 font-semibold py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-slate-700/70"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🏆</span>
                  <span>Bảng xếp hạng</span>
                </span>
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
              Được phát triển với ❤️ cho sinh viên FPT
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
