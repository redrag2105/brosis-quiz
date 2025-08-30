import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Home,
  Users,
  Clock,
  Target,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";
import { useAppContext } from "../context/hooks";
import { SAMPLE_LEADERBOARD } from "../data/leaderboardData";
import { ROUTES } from "../constants";
import { Button } from "../components/ui/button";
import type { LeaderboardEntry } from "../types";
import { Avatar } from "../components/avatar/Avatar";

export default function Leaderboard() {
  const { state } = useAppContext();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    // Combine sample data with current user's result if available
    let combinedLeaderboard = [...SAMPLE_LEADERBOARD];

    if (state.quizResult && state.studentInfo) {
      const userEntry: LeaderboardEntry = {
        rank: 0, // Will be calculated
        studentInfo: state.studentInfo,
        score: state.quizResult.score,
        percentage: Math.round(
          (state.quizResult.score / state.quizResult.totalQuestions) * 100
        ),
        completedAt: state.quizResult.completedAt,
      };

      // Remove any existing entry for this student
      combinedLeaderboard = combinedLeaderboard.filter(
        (entry) => entry.studentInfo.mssv !== state.studentInfo!.mssv
      );

      // Add user entry
      combinedLeaderboard.push(userEntry);
    }

    // Sort by score (descending) and then by completion time (ascending)
    combinedLeaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.completedAt.getTime() - b.completedAt.getTime();
    });

    // Update ranks
    combinedLeaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setLeaderboard(combinedLeaderboard);

    // Find user's rank if they completed the quiz
    if (state.quizResult && state.studentInfo) {
      const userIndex = combinedLeaderboard.findIndex(
        (entry) => entry.studentInfo.mssv === state.studentInfo!.mssv
      );
      setUserRank(userIndex >= 0 ? userIndex + 1 : null);
    }
  }, [state.quizResult, state.studentInfo]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <Trophy className="w-7 h-7 text-yellow-400" />
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          </motion.div>
        );
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Award className="w-6 h-6 text-purple-400" />;
      default:
        return (
          <div className="w-7 h-7 bg-slate-700/50 rounded-full flex items-center justify-center border border-slate-600">
            <span className="text-sm font-bold text-slate-300">#{rank}</span>
          </div>
        );
    }
  };

  const getHouseColor = (house: string) => {
    switch (house) {
      case "phoenix":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "unicorn":
        return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      case "thunderbird":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "faerie":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/40";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const floatingElements = [...Array(8)].map((_, i) => ({
    id: i,
    icon: [
      <Star className="w-3 h-3" />,
      <Sparkles className="w-4 h-4" />,
      <Crown className="w-3 h-3" />,
    ][i % 3],
    color: ["text-cyan-400/40", "text-purple-400/40", "text-yellow-400/40"][
      i % 3
    ],
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`leaderboard-orb-${i}`}
            className="absolute rounded-full opacity-8"
            style={{
              background: `radial-gradient(circle, ${
                ["cyan", "purple", "yellow", "blue"][i]
              }50 0%, transparent 70%)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${-50 + i * 35}%`,
              top: `${-25 + i * 20}%`,
            }}
            animate={{
              x: [-30, 30, -30],
              y: [-20, 20, -20],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 18 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating elements */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={`absolute ${element.color}`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.2, 0.6, 0.2],
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
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-yellow-500/5 rounded-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 rounded-full flex items-center justify-center relative"
                >
                  <Trophy className="w-8 h-8 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                  Bảng xếp hạng
                </h1>
              </div>

              <p className="text-slate-300 text-lg mb-6">
                Xem thành tích của bạn và các sinh viên khác
              </p>

              {userRank && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 rounded-xl p-4 inline-block"
                >
                  <span className="text-cyan-300 font-semibold flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Thứ hạng của bạn: #{userRank}</span>
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-sm text-slate-400 mb-1">
                Tổng số thí sinh
              </div>
              <div className="text-3xl font-bold text-blue-400">
                {leaderboard.length}
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-sm text-slate-400 mb-1">Điểm cao nhất</div>
              <div className="text-3xl font-bold text-green-400">
                {leaderboard.length > 0 ? leaderboard[0].score : 0}
                <span className="text-lg text-slate-500">/21</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-sm text-slate-400 mb-1">
                Cập nhật lần cuối
              </div>
              <div className="text-sm font-bold text-purple-400">
                {leaderboard.length > 0
                  ? formatTime(leaderboard[0].completedAt)
                  : "--"}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-800/20 rounded-3xl"></div>

          <div className="relative z-10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span>Xếp hạng chi tiết</span>
            </h2>

            <div className="overflow-x-auto md:overflow-x-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-4 px-3 font-semibold text-slate-300">
                      Hạng
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-300">
                      Sinh viên
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      Điểm
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      %
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      Nhà
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const isCurrentUser =
                      state.studentInfo &&
                      entry.studentInfo.mssv === state.studentInfo.mssv;

                    return (
                      <motion.tr
                        key={`${entry.studentInfo.mssv}-${index}`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: "rgba(71, 85, 105, 0.2)",
                          transition: { duration: 0.2 },
                        }}
                        className={`border-b border-slate-700/30 transition-all duration-300 ${
                          isCurrentUser
                            ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30"
                            : "hover:bg-slate-700/20"
                        }`}
                      >
                        <td className="py-5 px-3">
                          <div className="flex items-center justify-center">
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>

                        <td className="py-5 px-4">
                          <div>
                            <div
                              className={`font-semibold flex items-center space-x-3 ${
                                isCurrentUser ? "text-cyan-300" : "text-white"
                              }`}
                            >
                              <Avatar baseSkin={entry.studentInfo.nha} config={{ accessory: entry.studentInfo.avatar?.accessory ?? 'none' }} size={28} className="border border-slate-600 rounded-full" />
                              <span>{entry.studentInfo.ten}</span>
                              {isCurrentUser && (
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="text-cyan-400"
                                >
                                  👤
                                </motion.span>
                              )}
                              {entry.rank <= 3 && (
                                <motion.span
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="text-yellow-400"
                                >
                                  ⭐
                                </motion.span>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">
                              {entry.studentInfo.mssv} • {entry.studentInfo.lop}
                            </div>
                          </div>
                        </td>

                        <td className="py-5 px-3 text-center">
                          <div className="font-bold text-xl text-white">
                            {entry.score}
                            <span className="text-slate-400 text-sm ml-1">
                              /21
                            </span>
                          </div>
                        </td>

                        <td className="py-5 px-3 text-center">
                          <span
                            className={`font-bold text-lg ${
                              entry.percentage >= 80
                                ? "text-emerald-400"
                                : entry.percentage >= 60
                                ? "text-cyan-400"
                                : "text-purple-400"
                            }`}
                          >
                            {entry.percentage}%
                          </span>
                        </td>

                        <td className="py-5 px-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getHouseColor(
                              entry.studentInfo.nha
                            )}`}
                          >
                            {entry.studentInfo.nha}
                          </span>
                        </td>

                        <td className="py-5 px-3 text-center text-sm text-slate-400">
                          {formatTime(entry.completedAt)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8"
        >
          <Link to={ROUTES.HOME}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 px-8 py-3"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
