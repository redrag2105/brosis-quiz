import { useState, useEffect, useCallback } from "react";
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
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { leaderboardApi } from "@/apis/leaderboard/leaderboardApi";
import { ROUTES, QUIZ_CONFIG } from "../constants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar } from "../components/avatar/Avatar";
import type { ApiLeaderboardEntry, ApiStudent } from "@/types";

interface StudentRanking {
  rank: number;
  score: number;
  timeSpent: number; // in seconds
  student_id: string;
  student: ApiStudent;
}

const transformApiData = (apiEntry: ApiLeaderboardEntry): StudentRanking => ({
  rank: apiEntry.rank,
  score: Number(apiEntry.score),
  timeSpent: Math.floor(Number(apiEntry.total_ms) / 1000),
  student_id: apiEntry.student_id,
  student: {
    full_name: apiEntry.student.full_name,
    class_code: apiEntry.student.class_code,
    company_unit: apiEntry.student.company_unit,
    house: apiEntry.student.house.toLowerCase(),
    accessory: apiEntry.student.accessory ?? "none",
    shirt: apiEntry.student.shirt ?? "none",
  },
});

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<StudentRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchedMssv, setSearchedMssv] = useState<string | null>(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchEntry, setSearchEntry] = useState<StudentRanking | null>(null);

  // Fetch Top 10 lb on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await leaderboardApi.getLeaderboard();
        if (response.result && Array.isArray(response.result)) {
          const transformedData = response.result.map(transformApiData);
          setLeaderboard(transformedData);
        } else {
          setLeaderboard([]);
        }
      } catch (error) {
        toast.error("Không thể tải bảng xếp hạng", {
          description: "Vui lòng thử lại sau.",
        });
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSearch = useCallback(async () => {
    const mssv = searchId.trim().toUpperCase();
    setSearchSubmitted(true);
    setSearchedMssv(mssv);
    setSearchEntry(null);

    if (!mssv) return;

    setIsSearching(true);
    try {
      const response = await leaderboardApi.searchLeaderboard(mssv);
      if (response.result) {
        const transformedEntry = transformApiData(response.result);
        setSearchEntry(transformedEntry);
      }
    } catch (error) {
      setSearchEntry(null);
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchId]);

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

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-orange-400 via-yellow-600 to-amber-500";
      case 2:
        return "bg-gradient-to-r from-slate-300 via-slate-600 to-slate-200 text-slate-900";
      case 3:
        return "bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-600 text-amber-50";
      default:
        return "bg-slate-700 text-slate-200";
    }
  };

  const getHouseInitial = (house: string) =>
    house ? house.charAt(0).toUpperCase() : "?";

  const getHouseRing = (house: string) => {
    switch (house) {
      case "phoenix":
        return "ring-2 ring-red-400 shadow-red-400/30";
      case "unicorn":
        return "ring-2 ring-purple-400 shadow-purple-400/30";
      case "thunderbird":
        return "ring-2 ring-yellow-400 shadow-yellow-400/30";
      case "faerie":
        return "ring-2 ring-green-400 shadow-green-400/30";
      default:
        return "ring-2 ring-slate-400 shadow-slate-400/30";
    }
  };

  const getHousePodiumBg = (house: string) => {
    switch (house) {
      case "phoenix":
        return "from-red-900/15 to-red-400/10";
      case "unicorn":
        return "from-purple-500/15 to-pink-500/10";
      case "thunderbird":
        return "from-yellow-500/15 to-orange-500/10";
      case "faerie":
        return "from-green-500/15 to-emerald-500/10";
      default:
        return "from-slate-500/15 to-slate-400/10";
    }
  };

  const [expandedPodium, setExpandedPodium] = useState<number | null>(null);
  const togglePodium = (rank: number) => {
    setExpandedPodium((prev) => (prev === rank ? null : rank));
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".podium-card")) {
        setExpandedPodium(null);
      }
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
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3 text-center">
              <Crown className="w-6 h-6 text-yellow-400" />
              <span>Bảng Xếp Hạng</span>
            </h2>

            <div className="mb-4 gap-2 sm:items-center sm:justify-between">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="Nhập MSSV"
                  className="h-10"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-10 rounded-full cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  aria-label="Search"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {searchSubmitted && (
              <div className="mb-6">
                {isSearching ? (
                  <div className="text-sm text-slate-300 flex items-center gap-2 p-4">
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang tìm
                    kiếm...
                  </div>
                ) : searchEntry ? (
                  <>
                    {/* SEARCH MOBILE */}
                    <div className="md:hidden">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-slate-800/60 relative border border-slate-700 rounded-xl p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            {getRankIcon(searchEntry.rank)}
                          </div>
                          <Avatar
                            baseSkin={searchEntry.student.house}
                            config={{
                              accessory: searchEntry.student.accessory,
                              shirt: searchEntry.student.shirt,
                            }}
                            size={36}
                            className="border border-slate-600 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold leading-tight max-w-[12rem] truncate">
                              {searchEntry.student.full_name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {searchEntry.student_id} • Lớp{" "}
                              {searchEntry.student.class_code} • Đại đội{" "}
                              {searchEntry.student.company_unit}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="text-amber-400 font-bold">
                                {searchEntry.score}
                                <span className="text-slate-400">
                                  /{QUIZ_CONFIG.TOTAL_SCORE}
                                </span>
                              </span>
                              <span className="text-slate-400">
                                • {formatDuration(searchEntry.timeSpent)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 bottom-2 right-2 absolute rounded-md text-xs border ${getHouseColor(
                            searchEntry.student.house
                          )}`}
                        >
                          {toTitleCase(searchEntry.student.house)}
                        </span>
                      </motion.div>
                      <img src="/sep.svg" alt="sep" className="-mb-20 -mt-10" />
                    </div>

                    {/* SEARCH DESKTOP */}
                    <table className="hidden md:table w-full">
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
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-700/30">
                          <td className="py-4 px-3">
                            <div className="flex items-center justify-center">
                              {getRankIcon(searchEntry.rank)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-white flex items-center space-x-3">
                              <Avatar
                                baseSkin={searchEntry.student.house}
                                config={{
                                  accessory: searchEntry.student.accessory,
                                  shirt: searchEntry.student.shirt,
                                }}
                                size={28}
                                className="border border-slate-600 rounded-full"
                              />
                              <span className="max-w-[18rem] truncate">
                                {searchEntry.student.full_name}
                              </span>
                            </div>
                            <div className="text-sm text-slate-400">
                              {searchEntry.student_id} • Lớp{" "}
                              {searchEntry.student.class_code} • Đại đội{" "}
                              {searchEntry.student.company_unit}
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <div className="font-bold text-xl text-white">
                              {searchEntry.score}
                              <span className="text-slate-400 text-sm ml-1">
                                /{QUIZ_CONFIG.TOTAL_SCORE}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-center text-slate-300 font-medium">
                            {formatDuration(searchEntry.timeSpent)}
                          </td>
                          <td className="py-4 px-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getHouseColor(
                                searchEntry.student.house
                              )}`}
                            >
                              {toTitleCase(searchEntry.student.house)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="text-sm text-slate-300 p-4">
                    Không tìm thấy MSSV phù hợp.
                  </div>
                )}
              </div>
            )}

            {/* ========= LEADERBOARD ========= */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* TOP 3 PODIUM  */}
                {(() => {
                  const topThree = leaderboard.slice(0, 3);
                  if (!topThree.length) return null;
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
                          const ring = getHouseRing(entry.student.house);
                          const bg = getHousePodiumBg(entry.student.house);

                          return (
                            <motion.div
                              key={`${entry.student_id}-podium-${rank}`}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                type: "spring",
                                delay: 0.1 * colIdx,
                              }}
                              className={`podium-card relative mt-15 rounded-xl p-2 text-center bg-gradient-to-b ${bg} border border-slate-700/60 shadow-xl flex flex-col items-center`}
                            >
                              <div className="absolute top-1 right-1">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getHouseColor(
                                    entry.student.house
                                  )} border`}
                                >
                                  {getHouseInitial(entry.student.house)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => togglePodium(rank)}
                                className="w-full text-left"
                                aria-expanded={expandedPodium === rank}
                              >
                                {isWinner && (
                                  <motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="absolute -top-5 left-1/2 -translate-x-1/2"
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
                                      baseSkin={entry.student.house}
                                      config={{
                                        accessory: entry.student.accessory,
                                        shirt: entry.student.shirt,
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
                                    {entry.student.full_name}
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 text-[11px] mt-1 rounded-full font-medium font-mono ${getRankGradient(
                                      rank
                                    )}`}
                                  >
                                    {entry.student_id}
                                  </span>
                                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                                    <span className="text-amber-400 font-bold">
                                      {entry.score}
                                      <span className="text-slate-400">
                                        /{QUIZ_CONFIG.TOTAL_SCORE}
                                      </span>
                                    </span>
                                    <span className="text-slate-300">
                                      {formatDuration(entry.timeSpent)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                              {/* Tooltip popup (Mobile) */}
                              {expandedPodium === rank && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50">
                                  <div className="bg-slate-800/90 text-slate-200 px-3 py-2 rounded-md border border-slate-700 shadow-lg text-sm">
                                    <div>
                                      Lớp:{" "}
                                      <span className="font-semibold">
                                        {entry.student.class_code}
                                      </span>
                                    </div>
                                    <div className="whitespace-nowrap">
                                      Đại đội:{" "}
                                      <span className="font-semibold">
                                        {entry.student.company_unit}
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

                {/* Desktop Top 3 Podium */}
                {(() => {
                  const topThree = leaderboard.slice(0, 3);
                  if (!topThree.length) return null;
                  const ordered =
                    topThree.length === 3
                      ? [topThree[1], topThree[0], topThree[2]]
                      : topThree;
                  return (
                    <div className="hidden md:block mb-10 pb-20">
                      <div className="grid grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
                        {ordered.map((entry, colIdx) => {
                          const rank = entry.rank;
                          const isWinner = rank === 1;
                          const size = isWinner ? 96 : rank === 2 ? 80 : 72;
                          const ring = getHouseRing(entry.student.house);
                          const bg = getHousePodiumBg(entry.student.house);
                          return (
                            <motion.div
                              key={`${entry.student_id}-desk-${rank}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * colIdx }}
                              className={`relative mt-15 rounded-2xl p-4 text-center bg-gradient-to-b ${bg} border border-slate-700/60 shadow-2xl flex flex-col items-center`}
                            >
                              {isWinner && (
                                <motion.div
                                  initial={{ y: -12, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.15 }}
                                  className="absolute -top-7 left-1/2 -translate-x-1/2"
                                >
                                  <div className="relative">
                                    <Crown className="w-10 h-10 text-yellow-400" />
                                    <div className="absolute inset-0 rounded-full blur-md bg-yellow-400/40 opacity-60 animate-pulse" />
                                  </div>
                                </motion.div>
                              )}
                              <div className="absolute top-2 right-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getHouseColor(
                                    entry.student.house
                                  )} border`}
                                >
                                  {getHouseInitial(entry.student.house)}
                                </div>
                              </div>

                              <div className="relative">
                                <Avatar
                                  baseSkin={entry.student.house}
                                  config={{
                                    accessory: entry.student.accessory,
                                    shirt: entry.student.shirt,
                                  }}
                                  size={size}
                                  className={`rounded-full border border-slate-600 shadow-lg ${ring}`}
                                />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                  <div className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-900 bg-white/80">
                                    #{rank}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 text-white font-semibold text-base max-w-[14rem] truncate">
                                {entry.student.full_name}
                              </div>
                              <span
                                className={`mt-1 px-3 py-1 rounded-full text-xs font-medium font-mono ${getRankGradient(
                                  rank
                                )}`}
                              >
                                {entry.student_id}
                              </span>
                              <div className="mt-2 flex items-center justify-center gap-3 text-sm">
                                <span className="text-amber-400 font-bold">
                                  {entry.score}
                                  <span className="text-slate-400">
                                    /{QUIZ_CONFIG.TOTAL_SCORE}
                                  </span>
                                </span>
                                <span className="text-slate-300">
                                  {formatDuration(entry.timeSpent)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {leaderboard.slice(3, 10).map((entry, idx) => (
                    <motion.div
                      id={`card-${entry.student_id}-${idx + 3}`}
                      key={`${entry.student_id}-${entry.rank}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className={`group bg-slate-800/60 relative border rounded-xl p-4 flex items-center justify-between ${
                        searchedMssv === entry.student_id
                          ? "border-cyan-400"
                          : "border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                        <Avatar
                          baseSkin={entry.student.house}
                          config={{
                            accessory: entry.student.accessory,
                            shirt: entry.student.shirt,
                          }}
                          size={36}
                          className="border border-slate-600 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold leading-tight max-w-[12rem] truncate">
                            {entry.student.full_name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {entry.student_id} • Lớp {entry.student.class_code}{" "}
                            • Đại đội {entry.student.company_unit}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="text-amber-400 font-bold">
                              {entry.score}
                              <span className="text-slate-400">
                                /{QUIZ_CONFIG.TOTAL_SCORE}
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
                          entry.student.house
                        )}`}
                      >
                        {toTitleCase(entry.student.house)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
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
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.slice(3, 10).map((entry, index) => (
                        <motion.tr
                          id={`row-${entry.student_id}-${index}`}
                          key={`${entry.student_id}-${index}`}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className={`border-b border-slate-700/30 ${
                            searchedMssv === entry.student_id
                              ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                              : ""
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
                                className={`font-semibold flex items-center space-x-3 text-white`}
                              >
                                <Avatar
                                  baseSkin={entry.student.house}
                                  config={{
                                    accessory: entry.student.accessory,
                                    shirt: entry.student.shirt,
                                  }}
                                  size={28}
                                  className="border border-slate-600 rounded-full"
                                />
                                <span className="max-w-[18rem] truncate">
                                  {entry.student.full_name}
                                </span>
                              </div>
                              <div className="text-sm text-slate-400">
                                {entry.student_id} • Lớp{" "}
                                {entry.student.class_code} • Đại đội{" "}
                                {entry.student.company_unit}
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-3 text-center">
                            <div className="font-bold text-xl text-white">
                              {entry.score}
                              <span className="text-slate-400 text-sm ml-0.5">
                                /{QUIZ_CONFIG.TOTAL_SCORE}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-3 text-center text-slate-300 font-medium">
                            {formatDuration(entry.timeSpent)}
                          </td>
                          <td className="py-5 px-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${getHouseColor(
                                entry.student.house
                              )}`}
                            >
                              {toTitleCase(entry.student.house)}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </motion.div>

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
