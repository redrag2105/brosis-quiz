import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Sparkles, Star, Award } from "lucide-react";
import { useAppContext } from "../context/hooks";
import { ROUTES } from "../constants";
import { Button } from "../components/ui/button";

export default function Results() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const { state } = useAppContext();

  const handleFinish = () => {
    dispatch({ type: "SET_STUDENT_INFO", payload: null });
    navigate(ROUTES.REGISTRATION);
  };

  useEffect(() => {
    if (!state.quizResult || !state.studentInfo) {
      navigate(ROUTES.HOME);
      return;
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

  const correctCount = Number(state.quizResult.correct_count ?? 0);
  const totalCount = Number(state.quizResult.total_count ?? 0);
  const percentage = Math.round((correctCount / Math.max(totalCount, 1)) * 100);

  const startedAt = state.quizResult.started_at
    ? new Date(state.quizResult.started_at)
    : null;
  const finishedAt = state.quizResult.finished_at
    ? new Date(state.quizResult.finished_at)
    : null;
  const timeSpent =
    startedAt && finishedAt
      ? Math.max(
          0,
          Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000)
        )
      : 0;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-400 to-green-500";
    if (percentage >= 60) return "from-amber-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  const floatingElements = [...Array(12)].map((_, i) => ({
    id: i,
    icon: [
      <Star className="w-4 h-4" />,
      <Sparkles className="w-3 h-3" />,
      <Award className="w-4 h-4" />,
    ][i % 3],
    color: [
      "text-amber-400",
      "text-orange-400",
      "text-yellow-400",
      "text-red-400",
    ][i % 4],
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
                ["cyan", "purple", "yellow", "pink"][i]
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
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center relative">
                <Trophy className="w-9 h-9 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl md:text-4xl -mt-16 font-extrabold mb-2 text-gradient-cyber"
            >
              Kết quả bài thi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-slate-300 text-sm md:text-base max-w-xl mx-auto"
            >
              Tổng quan kết quả và thông tin bài thi của bạn
            </motion.p>
          </div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-slate-800/50 border border-slate-600/50 rounded-2xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="col-span-1 text-center">
                <div
                  className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center ${getScoreColor(
                    percentage
                  )} bg-gradient-to-r`}
                  style={{ backgroundClip: "padding-box" }}
                >
                  <div className="text-5xl font-bold text-white">
                    {percentage}%
                  </div>
                </div>
                <div className="text-sm text-slate-300 mt-2">
                  {correctCount}/{totalCount} câu đúng
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400">Điểm</div>
                    <div className="text-lg font-semibold text-amber-300">
                      {state.quizResult.score}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400">Tổng câu hỏi</div>
                    <div className="text-lg font-semibold text-cyan-300">
                      {totalCount}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400">Thời gian làm</div>
                    <div className="text-lg font-semibold text-blue-200">
                      {minutes}:{seconds.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10"
          >
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
              <div className="text-sm text-slate-400 mb-1">Bắt đầu</div>
              <div className="font-medium text-slate-100">
                {startedAt ? startedAt.toLocaleString() : "-"}
              </div>
            </div>

            <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
              <div className="text-sm text-slate-400 mb-1">Hoàn thành</div>
              <div className="font-medium text-slate-100">
                {finishedAt ? finishedAt.toLocaleString() : "-"}
              </div>
            </div>
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
                <span className="font-medium text-cyan-400">
                  {state.studentInfo.mssv}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Lớp:</span>{" "}
                <span className="font-medium text-purple-400">
                  {state.studentInfo.lop}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Nhà:</span>{" "}
                <span className="font-medium text-yellow-400 capitalize">
                  {state.studentInfo.nha}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Đại đội:</span>{" "}
                <span className="font-medium text-pink-400">
                  {state.studentInfo.daiDoi}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Primary action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="relative z-10 flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleFinish}
                className="group px-8 py-4 rounded-xl cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white relative overflow-hidden"
              >
                <span className="relative z-10">Đã hiểu</span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
