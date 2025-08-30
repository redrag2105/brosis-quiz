import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Clock,
  Users,
  Home,
} from "lucide-react";
import { Menu, X } from "lucide-react";
import { useAppContext } from "../context/hooks";
import { SAMPLE_QUIZ_QUESTIONS } from "../data/quizData";
import { ROUTES, QUIZ_CONFIG } from "../constants";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/avatar/Avatar";
import type { House } from "../types";

export default function Quiz() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const houseKey: House = state.studentInfo?.nha ?? "faerie";
  const HOUSE_LABEL_MAP: Record<House, string> = {
    phoenix: "Phoenix",
    faerie: "Faerie",
    thunderbird: "ThunderBird",
    unicorn: "Unicorn",
  };
  const HOUSE_BADGE_COLORS: Record<House, string> = {
    phoenix: "bg-orange-500/20 border-orange-500/40 text-orange-300",
    faerie: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    thunderbird: "bg-yellow-400/20 border-yellow-400/40 text-yellow-300",
    unicorn: "bg-pink-500/20 border-pink-500/40 text-pink-300",
  };
  const houseLabel = HOUSE_LABEL_MAP[houseKey];

  const currentQuestion = SAMPLE_QUIZ_QUESTIONS[state.currentQuestionIndex];
  const answeredCount = state.answers.length;
  const progress = (answeredCount / QUIZ_CONFIG.TOTAL_QUESTIONS) * 100;

  useEffect(() => {
    if (!state.studentInfo) {
      navigate(ROUTES.REGISTRATION);
      return;
    }
  }, [state.studentInfo, navigate]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  useEffect(() => {
    // Check if we have an existing answer for this question
    const existingAnswer = state.answers.find(
      (answer) => answer.questionId === currentQuestion?.id
    );
    setSelectedAnswer(existingAnswer?.selectedAnswer ?? null);
  }, [state.currentQuestionIndex, state.answers, currentQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    if (currentQuestion) {
      dispatch({
        type: "SET_ANSWER",
        payload: {
          questionId: currentQuestion.id,
          selectedAnswer: answerIndex,
          isCorrect: answerIndex === currentQuestion.correctAnswer,
        },
      });
    }
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < QUIZ_CONFIG.TOTAL_QUESTIONS - 1) {
      dispatch({ type: "NEXT_QUESTION" });
      setSelectedAnswer(null);
    } else {
      // Complete quiz
      const correctAnswers = state.answers.filter(
        (answer) => answer.isCorrect
      ).length;
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      const result = {
        studentInfo: state.studentInfo!,
        answers: state.answers,
        score: correctAnswers,
        totalQuestions: QUIZ_CONFIG.TOTAL_QUESTIONS,
        completedAt: new Date(),
        timeSpent,
      };

      dispatch({ type: "COMPLETE_QUIZ", payload: result });
      navigate(ROUTES.RESULTS);
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: "PREV_QUESTION" });
      setSelectedAnswer(null);
    }
  };

  if (!state.studentInfo || !currentQuestion) {
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

  const floatingElements = [...Array(6)].map((_, i) => ({
    id: i,
    icon: [
      <Star className="w-3 h-3" />,
      <Sparkles className="w-3 h-3" />,
      <Zap className="w-4 h-4" />,
    ][i % 3],
    color: ["text-amber-400/40", "text-orange-400/40", "text-yellow-400/40"][
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
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`quiz-orb-${i}`}
            className="absolute rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${
                ["amber", "orange", "yellow"][i]
              }60 0%, transparent 70%)`,
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              left: `${-10 + i * 40}%`,
              top: `${-20 + i * 30}%`,
            }}
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                baseSkin={state.studentInfo?.nha}
                config={{
                  accessory:
                    state.studentInfo?.avatar?.accessory ??
                    state.avatar.accessory,
                }}
                size={48}
                className="border border-slate-600 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {state.studentInfo.ten}
                  </h1>
                  <span className={`px-2 py-1 rounded-full text-xs border inline-flex items-center ${HOUSE_BADGE_COLORS[houseKey]}`}>
                    {houseLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 rounded-full text-xs bg-slate-700/40 border border-slate-600 text-slate-300 inline-flex items-center gap-1">
                    <Users className="w-3 h-3" /> Lớp {state.studentInfo.lop}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-slate-700/40 border border-slate-600 text-slate-300 inline-flex items-center gap-1">
                    <Home className="w-3 h-3" /> Đại đội{" "}
                    {state.studentInfo.daiDoi}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700/40 text-slate-200 px-3 py-2 hover:bg-slate-700/60"
              onClick={() => setMobilePanelOpen(true)}
              aria-label="Danh sách câu hỏi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-slate-300 font-medium mb-2">
                Câu {state.currentQuestionIndex + 1} /{" "}
                {QUIZ_CONFIG.TOTAL_QUESTIONS}
              </p>
              <div className="w-40 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse opacity-70"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:mt-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[360px]">
          {/* Question List Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-800/40 backdrop-blur-xl max-h-[403px] hidden md:flex flex-col rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-slate-400/5 rounded-2xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="mb-2">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white">
                    Danh sách câu hỏi
                  </h3>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-5 xl:grid-cols-6 md:grid-cols-15 gap-2 p-1 ">
                  {[...Array(QUIZ_CONFIG.TOTAL_QUESTIONS)].map((_, index) => {
                    const questionId = SAMPLE_QUIZ_QUESTIONS[index]?.id;
                    const isAnswered = state.answers.some(
                      (answer) => answer.questionId === questionId
                    );
                    const isCurrent = state.currentQuestionIndex === index;
                    const isPast = index < state.currentQuestionIndex;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1 * (index % 10),
                          duration: 0.3,
                        }}
                        className={`
                          relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 border-2
                          ${
                            isCurrent
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white shadow-lg shadow-amber-500/30 cursor-pointer"
                              : isAnswered
                              ? "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 cursor-pointer"
                              : index === state.currentQuestionIndex - 1 ||
                                (index === state.currentQuestionIndex + 1 &&
                                  selectedAnswer !== null)
                              ? "bg-slate-700/30 border-slate-600/50 text-slate-300 hover:border-amber-400 hover:bg-slate-700/50 cursor-pointer"
                              : isPast
                              ? "bg-slate-600/30 border-slate-600/50 text-slate-400 cursor-pointer"
                              : "bg-slate-700/30 border-slate-600/50 text-slate-500 cursor-pointer"
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          dispatch({
                            type: "SET_QUESTION_INDEX",
                            payload: index,
                          });
                          setSelectedAnswer(null);
                        }}
                      >
                        {/* Question number */}
                        <span className="relative z-10">{index + 1}</span>

                        {/* Status indicators */}
                        {isAnswered && !isCurrent && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <span className="text-white text-xs">✓</span>
                          </motion.div>
                        )}

                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-amber-300"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex gap-20">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded border"></div>
                    <span className="text-slate-400">Câu hiện tại</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded relative">
                      <span className="absolute inset-0 flex items-center justify-center text-green-400 text-xs">
                        ✓
                      </span>
                    </div>
                    <span className="text-slate-400">Đã trả lời</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-700/30 border border-slate-600/50 rounded"></div>
                    <span className="text-slate-400">Chưa trả lời</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold font-clock tabular-nums tracking-wider text-lg">
                    {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
                    {String(elapsed % 60).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 relative overflow-hidden">
                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-2xl font-semibold text-white mb-6 leading-relaxed"
                  >
                    {currentQuestion.question}
                  </motion.h2>

                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <motion.label
                        key={index}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        whileHover={{
                          scale: 1.02,
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                          selectedAnswer === index
                            ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                            : "border-slate-600/50 hover:border-slate-500 bg-slate-700/20 hover:bg-slate-700/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={index}
                          checked={selectedAnswer === index}
                          onChange={() => handleAnswerSelect(index)}
                          className="sr-only"
                        />

                        <div
                          className={`w-5 h-5 rounded-full mr-4 border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedAnswer === index
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-400 group-hover:border-slate-300"
                          }`}
                        >
                          {selectedAnswer === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>

                        <span className="text-slate-200 flex-1 group-hover:text-white transition-colors duration-300">
                          {option}
                        </span>

                        {selectedAnswer === index && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-amber-400 ml-2"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile question panel */}
        {mobilePanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobilePanelOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-slate-800 border-r border-slate-700 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Câu hỏi</h3>
                <button
                  className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700/40 text-slate-200 px-2 py-1 hover:bg-slate-700/60"
                  onClick={() => setMobilePanelOpen(false)}
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(QUIZ_CONFIG.TOTAL_QUESTIONS)].map((_, index) => {
                  const questionId = SAMPLE_QUIZ_QUESTIONS[index]?.id;
                  const isAnswered = state.answers.some(
                    (answer) => answer.questionId === questionId
                  );
                  const isCurrent = state.currentQuestionIndex === index;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        dispatch({
                          type: "SET_QUESTION_INDEX",
                          payload: index,
                        });
                        setSelectedAnswer(null);
                        setMobilePanelOpen(false);
                      }}
                      className={`w-12 h-12 rounded-lg border-2 text-sm font-medium ${
                        isCurrent
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white"
                          : isAnswered
                          ? "bg-green-500/20 border-green-500/50 text-green-400"
                          : "bg-slate-700/30 border-slate-600/50 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Fixed Navigation Bar */}
      <div className="fixed xl:bottom-36 bottom-1 left-0 right-0 z-20 ">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {state.currentQuestionIndex > 0 ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex cursor-pointer text-lg rounded-lg items-center bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 py-5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </Button>
            </motion.div>
          ) : (
            <div />
          )}

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleNext}
              className="flex items-center text-lg rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50 py-5 relative overflow-hidden group"
            >
              <span>
                {state.currentQuestionIndex === QUIZ_CONFIG.TOTAL_QUESTIONS - 1
                  ? "🎉 Hoàn thành"
                  : "Tiếp theo"}
              </span>
              <ArrowRight className="w-4 h-4" />
              <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
