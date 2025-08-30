import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Clock, Target, Home, BarChart3, Sparkles, Star, Award } from "lucide-react";
import { useAppContext } from "../context/hooks";
import { ROUTES } from "../constants";
import { Button } from "../components/ui/button";

export default function Results() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!state.quizResult || !state.studentInfo) {
      navigate(ROUTES.HOME);
      return;
    }

    // Show confetti animation for good scores
    if (state.quizResult.score >= 15) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [state.quizResult, state.studentInfo, navigate]);

  if (!state.quizResult || !state.studentInfo) {
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

  const { score, totalQuestions, timeSpent } = state.quizResult;
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-400 to-green-500";
    if (percentage >= 60) return "from-amber-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Xuất sắc! 🌟";
    if (percentage >= 80) return "Rất tốt! 👏";
    if (percentage >= 70) return "Tốt! 👍";
    if (percentage >= 60) return "Khá! 😊";
    return "Cần cố gắng thêm! 💪";
  };

  const handleRetakeQuiz = () => {
    dispatch({ type: "RESET_QUIZ" });
    navigate(ROUTES.QUIZ);
  };

  const floatingElements = [...Array(12)].map((_, i) => ({
    id: i,
    icon: [<Star className="w-4 h-4" />, <Sparkles className="w-3 h-3" />, <Award className="w-4 h-4" />][i % 3],
    color: ['text-amber-400', 'text-orange-400', 'text-yellow-400', 'text-red-400'][i % 4],
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`result-orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ['cyan', 'purple', 'yellow', 'pink'][i]
              }60 0%, transparent 70%)`,
              width: `${250 + i * 75}px`,
              height: `${250 + i * 75}px`,
              left: `${-20 + i * 30}%`,
              top: `${-15 + i * 25}%`,
            }}
            animate={{
              x: [-40, 40, -40],
              y: [-20, 20, -20],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating celebration elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={`absolute ${element.color}`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                ['bg-cyan-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'][i % 4]
              }`}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative overflow-hidden"
        >
          {/* Card background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 rounded-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative mx-auto mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center relative">
                <Trophy className="w-12 h-12 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              </div>
              {percentage >= 80 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-sm">��</span>
                </motion.div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-3"
            >
              Kết quả tuyệt vời!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-slate-300 text-lg"
            >
              Chúc mừng{" "}
              <span className="font-semibold text-amber-400">
                {state.studentInfo.ten}
              </span>
              ! 🎉
            </motion.p>
          </div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/50 rounded-2xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>

            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                className={`text-7xl font-bold mb-4 bg-gradient-to-r ${getScoreColor(percentage)} bg-clip-text text-transparent`}
              >
                {percentage}%
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-xl text-slate-300 mb-3"
              >
                {score}/{totalQuestions} câu đúng
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-lg font-semibold text-cyan-400 bg-cyan-500/10 rounded-lg p-3"
              >
                {getScoreMessage(percentage)}
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-2 gap-6 mb-8 relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center backdrop-blur-sm"
            >
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-sm text-slate-400 mb-1">Thời gian hoàn thành</div>
              <div className="font-bold text-blue-400 text-lg">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center backdrop-blur-sm"
            >
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-sm text-slate-400 mb-1">Độ chính xác</div>
              <div className="font-bold text-green-400 text-lg">{percentage}%</div>
            </motion.div>
          </motion.div>

          {/* Student Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 mb-8 backdrop-blur-sm relative z-10"
          >
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <span>👤</span>
              <span>Thông tin sinh viên</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">MSSV:</span>{" "}
                <span className="font-medium text-cyan-400">{state.studentInfo.mssv}</span>
              </div>
              <div>
                <span className="text-slate-400">Lớp:</span>{" "}
                <span className="font-medium text-purple-400">{state.studentInfo.lop}</span>
              </div>
              <div>
                <span className="text-slate-400">Nhà:</span>{" "}
                <span className="font-medium text-yellow-400 capitalize">
                  {state.studentInfo.nha}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Đại đội:</span>{" "}
                <span className="font-medium text-pink-400">{state.studentInfo.daiDoi}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRetakeQuiz}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 py-3"
              >
                <Target className="w-4 h-4" />
                <span>Làm lại</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={ROUTES.LEADERBOARD}>
                <Button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3">
                  <BarChart3 className="w-4 h-4" />
                  <span>Bảng xếp hạng</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={ROUTES.HOME}>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 py-3"
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
