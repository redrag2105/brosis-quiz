import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Home,
  Crown,
  Sparkles,
  Star,
} from "lucide-react";

import { SAMPLE_LEADERBOARD } from "../data/leaderboardData";
import { ROUTES, QUIZ_CONFIG } from "../constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import type { LeaderboardEntry } from "../types";
import { Avatar } from "../components/avatar/Avatar";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchedMssv, setSearchedMssv] = useState<string | null>(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchEntry, setSearchEntry] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const combinedLeaderboard = [...SAMPLE_LEADERBOARD]
      .sort((a, b) =>
        b.score !== a.score
          ? b.score - a.score
          : a.completedAt.getTime() - b.completedAt.getTime()
      )
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    setLeaderboard(combinedLeaderboard);
  }, []);

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

  // Rank color gradients for MSSV badges
  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-orange-400 via-yellow-600 to-amber-500"; // gold
      case 2:
        return "bg-gradient-to-r from-slate-300 via-slate-600 to-slate-200 text-slate-900"; // silver
      case 3:
        return "bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-600 text-amber-50"; // bronze
      default:
        return "bg-slate-700 text-slate-200";
    }
  };

  const getHouseInitial = (house: string) =>
    house ? house.charAt(0).toUpperCase() : "?";

  const [expandedPodium, setExpandedPodium] = useState<number | null>(null);
  const togglePodium = (rank: number) => {
    setExpandedPodium((prev) => (prev === rank ? null : rank));
  };

  // Close tooltip when clicking outside or pressing Escape (Mobile podium)
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".podium-card")) setExpandedPodium(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedPodium(null);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined || seconds === null) return "--";
    const s = Math.max(0, Math.floor(seconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
          sec
        ).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const toTitleCase = (str: string) =>
    str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;

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

  const handleSearch = () => {
    const m = searchId.trim();
    if (!m) {
      setSearchSubmitted(true);
      setSearchedMssv(null);
      setSearchEntry(null);
      return;
    }
    const idx = leaderboard.findIndex(
      (e) => e.studentInfo.mssv.toLowerCase() === m.toLowerCase()
    );
    setSearchSubmitted(true);
    if (idx >= 0) {
      setSearchedMssv(leaderboard[idx].studentInfo.mssv);
      setSearchEntry(leaderboard[idx]);
      if (idx < 10) {
        setTimeout(() => {
          const anchorIdRow = `row-${leaderboard[idx].studentInfo.mssv}-${idx}`;
          const anchorIdCard = `card-${leaderboard[idx].studentInfo.mssv}-${idx}`;
          const el =
            document.getElementById(anchorIdRow) ||
            document.getElementById(anchorIdCard);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    } else {
      setSearchedMssv(null);
      setSearchEntry(null);
    }
  };

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
      <div className="relative z-10 max-w-7xl mx-auto p-3">
        {/* Leaderboard Table */}
        <motion.div
          id="full-leaderboard"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-[#7D2BB5]/5 to-slate-800/20 rounded-3xl"></div>

          <div className="relative z-10 p-3 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span>Bảng Xếp Hạng (TOP 10)</span>
            </h2>

            {/* Search by MSSV */}
            <div className="mb-4 gap-2 sm:items-center sm:justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Nhập MSSV"
                  className="h-10 "
                />
                <Button
                  onClick={handleSearch}
                  className="h-10 rounded-xl cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  <Search className="w-4 h-4" />
                  Tìm
                </Button>
              </div>
            </div>

            {/* Search Submit for Mobile */}
            {searchSubmitted && (
              <div className="md:hidden mb-1">
                {searchEntry ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="group bg-slate-800/60 relative border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-slate-500"
                  >
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b from-amber-500/50 to-orange-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        {getRankIcon(searchEntry.rank)}
                      </div>
                      <Avatar
                        baseSkin={searchEntry.studentInfo.nha}
                        config={{
                          accessory:
                            searchEntry.studentInfo.avatar?.accessory ?? "none",
                        }}
                        size={36}
                        className="border border-slate-600 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold leading-tight max-w-[12rem] truncate">
                          {searchEntry.studentInfo.ten}
                        </div>
                        <div className="text-xs text-slate-400">
                          {searchEntry.studentInfo.mssv} • Lớp{" "}
                          {searchEntry.studentInfo.lop} • Đại đội{" "}
                          {searchEntry.studentInfo.daiDoi}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span className="text-amber-400 font-bold">
                            {searchEntry.score}
                            <span className="text-slate-400">
                              /{QUIZ_CONFIG.TOTAL_QUESTIONS}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            • {formatDuration(searchEntry.timeSpent)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-md absolute bottom-2 right-2 text-xs border capitalize ${getHouseColor(
                          searchEntry.studentInfo.nha
                        )}`}
                      >
                        {toTitleCase(searchEntry.studentInfo.nha)}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-sm text-slate-300">
                    Không tìm thấy MSSV phù hợp.
                  </div>
                )}
                <img src="/sep.svg" alt="sep" className="-mb-16 -mt-10" />
              </div>
            )}

            {/* Search Submit for Desktop */}
            {searchSubmitted && (
              <div className="hidden md:block mb-6">
                {searchEntry ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-3 font-semibold text-slate-300">
                          Hạng
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-300">
                          Sinh viên
                        </th>
                        <th className="text-center py-3 px-3 font-semibold text-slate-300">
                          Điểm
                        </th>
                        <th className="text-center py-3 px-3 font-semibold text-slate-300">
                          Thời gian làm bài
                        </th>
                        <th className="text-center py-3 px-3 font-semibold text-slate-300">
                          Nhà
                        </th>
                        <th className="text-center py-3 px-3 font-semibold text-slate-300">
                          Thời gian hoàn thành
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/30 hover:bg-slate-700/20">
                        <td className="py-4 px-3">
                          <div className="flex items-center justify-center">
                            {getRankIcon(searchEntry.rank)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white flex items-center space-x-3">
                            <Avatar
                              baseSkin={searchEntry.studentInfo.nha}
                              config={{
                                accessory:
                                  searchEntry.studentInfo.avatar?.accessory ??
                                  "none",
                              }}
                              size={28}
                              className="border border-slate-600 rounded-full"
                            />
                            <span className="max-w-[18rem] truncate">
                              {searchEntry.studentInfo.ten}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            {searchEntry.studentInfo.mssv} • Lớp{" "}
                            {searchEntry.studentInfo.lop} • Đại đội{" "}
                            {searchEntry.studentInfo.daiDoi}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <div className="font-bold text-xl text-white">
                            {searchEntry.score}
                            <span className="text-slate-400 text-sm ml-1">
                              /{QUIZ_CONFIG.TOTAL_QUESTIONS}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center text-slate-300 font-medium">
                          {formatDuration(searchEntry.timeSpent)}
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getHouseColor(
                              searchEntry.studentInfo.nha
                            )}`}
                          >
                            {toTitleCase(searchEntry.studentInfo.nha)}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-center text-sm text-slate-400">
                          {formatTime(searchEntry.completedAt)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-slate-300">
                    Không tìm thấy MSSV phù hợp.
                  </div>
                )}
              </div>
            )}

            {/* Top 3 Podium */}
            {(() => {
              const topThree = leaderboard.slice(0, 3);
              if (!topThree.length) return null;
              // Ordered (2nd, 1st, 3rd)
              const ordered =
                topThree.length === 3
                  ? [topThree[1], topThree[0], topThree[2]]
                  : topThree;

              return (
                <div className="md:hidden mb-14">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    {ordered.map((entry, colIdx) => {
                      const rank = entry.rank;
                      const isWinner = rank === 1;
                      const sizes = isWinner ? 64 : rank === 2 ? 52 : 48;
                      const ring = isWinner
                        ? "ring-2 ring-amber-400 shadow-amber-400/30"
                        : rank === 2
                        ? "ring-2 ring-slate-300 shadow-slate-300/20"
                        : "ring-2 ring-purple-400 shadow-purple-400/20";
                      const bg = isWinner
                        ? "from-amber-500/15 to-orange-500/10"
                        : rank === 2
                        ? "from-slate-500/15 to-slate-400/10"
                        : "from-purple-500/15 to-pink-500/10";

                      return (
                        <motion.div
                          key={`${entry.studentInfo.mssv}-podium-${rank}`}
                          initial={{ opacity: 0, y: 16, scale: 0.98 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 20,
                            delay: 0.06 * colIdx,
                          }}
                          className={`podium-card relative mt-15 rounded-xl p-2 text-center bg-gradient-to-b ${bg} border border-slate-700/60 shadow-xl overflow-visible flex flex-col items-center justify-start`}
                        >
                          {/* House Badge (top-right) */}
                          <div className="absolute top-1 right-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getHouseColor(
                                entry.studentInfo.nha
                              )} border`}
                            >
                              {getHouseInitial(entry.studentInfo.nha)}
                            </div>
                          </div>

                          {/* Tappable podium to toggle extra info */}
                          <button
                            type="button"
                            onClick={() => togglePodium(rank)}
                            className="w-full text-left"
                            aria-expanded={expandedPodium === rank}
                          >
                            {/* Crown for the winner */}
                            {isWinner && (
                              <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="absolute -top-5 left-1/2 -translate-x-1/2"
                                aria-hidden
                              >
                                <div className="relative">
                                  <Crown className="w-8 h-8 text-yellow-400" />
                                  <div className="absolute inset-0 rounded-full blur-md bg-yellow-400/40 opacity-60 animate-pulse" />
                                </div>
                              </motion.div>
                            )}

                            <div className="flex flex-col items-center gap-1">
                              <div className="relative">
                                <Avatar
                                  baseSkin={entry.studentInfo.nha}
                                  config={{
                                    accessory:
                                      entry.studentInfo.avatar?.accessory ??
                                      "none",
                                  }}
                                  size={sizes}
                                  className={`rounded-full border border-slate-600 shadow-lg ${ring}`}
                                />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                  <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-900 bg-white/80">
                                    #{rank}
                                  </div>
                                </div>
                              </div>

                              <div className="text-white font-semibold text-sm text-center flex flex-col justify-center px-1 break-words min-h-[2.5rem] leading-tight mt-3 w-30">
                                {entry.studentInfo.ten}
                              </div>

                              {/* MSSV */}
                              <span
                                className={`px-2 py-0.5 text-[11px] mt-1 rounded-full font-medium font-mono ${getRankGradient(
                                  rank
                                )}`}
                              >
                                {entry.studentInfo.mssv}
                              </span>
                              <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                                <span className="text-amber-400 font-bold">
                                  {entry.score}
                                  <span className="text-slate-400">
                                    /{QUIZ_CONFIG.TOTAL_QUESTIONS}
                                  </span>
                                </span>
                                <span className="text-slate-300">
                                  {formatDuration(entry.timeSpent)}
                                </span>
                              </div>
                            </div>
                          </button>

                          {/* Tooltip popup (mobile) */}
                          {expandedPodium === rank && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50">
                              <div className="bg-slate-800/90 text-slate-200 px-3 py-2 rounded-md border border-slate-700 shadow-lg text-sm">
                                <div className="whitespace-nowrap">
                                  Lớp:{" "}
                                  <span className="font-semibold">
                                    {entry.studentInfo.lop}
                                  </span>
                                </div>
                                <div className="whitespace-nowrap">
                                  Đại đội:{" "}
                                  <span className="font-semibold">
                                    {entry.studentInfo.daiDoi}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {leaderboard.slice(3, 10).map((entry, idx) => (
                <motion.div
                  id={`card-${entry.studentInfo.mssv}-${idx + 3}`}
                  key={`${entry.studentInfo.mssv}-${entry.rank}-${idx + 3}`}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    delay: 0.03 * idx,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group bg-slate-800/60 relative border rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${
                    searchedMssv === entry.studentInfo.mssv
                      ? "border-cyan-400"
                      : "border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.03 * idx }}
                  >
                    <motion.div
                      className="absolute top-0 -left-1/3 h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-150%" }}
                      whileInView={{ x: "150%" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        ease: "linear",
                        delay: 0.03 * idx,
                      }}
                    />
                  </motion.div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar
                      baseSkin={entry.studentInfo.nha}
                      config={{
                        accessory:
                          entry.studentInfo.avatar?.accessory ?? "none",
                      }}
                      size={36}
                      className="border border-slate-600 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold leading-tight max-w-[12rem] truncate">
                        {entry.studentInfo.ten}
                      </div>
                      <div className="text-xs text-slate-400">
                        {entry.studentInfo.mssv} • Lớp {entry.studentInfo.lop} •
                        Đại đội {entry.studentInfo.daiDoi}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs">
                        <span className="text-amber-400 font-bold">
                          {entry.score}
                          <span className="text-slate-400">
                            /{QUIZ_CONFIG.TOTAL_QUESTIONS}
                          </span>
                        </span>
                        <span className="text-slate-400">
                          • {formatDuration(entry.timeSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 bottom-2 right-2 absolute rounded-md text-xs border ${getHouseColor(
                      entry.studentInfo.nha
                    )}`}
                  >
                    {toTitleCase(entry.studentInfo.nha)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto md:overflow-x-hidden">
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
                      Thời gian làm bài
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      Nhà
                    </th>
                    <th className="text-center py-4 px-3 font-semibold text-slate-300">
                      Thời gian hoàn thành
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((entry, index) => {
                    const isCurrentUser = false;

                    return (
                      <motion.tr
                        id={`row-${entry.studentInfo.mssv}-${index}`}
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
                          searchedMssv &&
                          entry.studentInfo.mssv === searchedMssv
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
                              <Avatar
                                baseSkin={entry.studentInfo.nha}
                                config={{
                                  accessory:
                                    entry.studentInfo.avatar?.accessory ??
                                    "none",
                                }}
                                size={28}
                                className="border border-slate-600 rounded-full"
                              />
                              <span className="max-w-[18rem] truncate">
                                {entry.studentInfo.ten}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400">
                              {entry.studentInfo.mssv} • Lớp{" "}
                              {entry.studentInfo.lop} • Đại đội{" "}
                              {entry.studentInfo.daiDoi}
                            </div>
                          </div>
                        </td>

                        <td className="py-5 px-3 text-center">
                          <div className="font-bold text-xl text-white">
                            {entry.score}
                            <span className="text-slate-400 text-sm ml-1">
                              /{QUIZ_CONFIG.TOTAL_QUESTIONS}
                            </span>
                          </div>
                        </td>

                        <td className="py-5 px-3 text-center text-slate-300 font-medium">
                          {formatDuration(entry.timeSpent)}
                        </td>

                        <td className="py-5 px-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getHouseColor(
                              entry.studentInfo.nha
                            )}`}
                          >
                            {toTitleCase(entry.studentInfo.nha)}
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
                className="bg-slate-700/30 cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 px-8 py-3"
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
