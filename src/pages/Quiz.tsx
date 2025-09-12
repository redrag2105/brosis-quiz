import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Users,
  Home,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useAppContext } from "../context/hooks";
import { ROUTES, STORAGE_KEYS } from "../constants";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/avatar/Avatar";
import type { House } from "../types";
import { toast } from "sonner";
import { answerApi } from "@/apis/question/answerApi";
import { attemptApi } from "@/apis/register/attemptApi";

export default function Quiz() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { quizData, studentInfo, currentQuestionIndex, answers } = state;

  const questions = useMemo(() => quizData?.questions ?? [], [quizData]);

  const attemptId = quizData?.attemptId;
  const totalQuestions = questions.length;

  const houseKey: House = state.studentInfo?.nha ?? "faerie";
  const HOUSE_LABEL_MAP: Record<House, string> = {
    phoenix: "Phoenix",
    faerie: "Faerie",
    thunderbird: "ThunderBird",
    unicorn: "Unicorn",
  };
  const HOUSE_BADGE_COLORS: Record<House, string> = {
    phoenix: "bg-red-500/20 text-red-400 border-red-500/40",
    faerie: "bg-green-500/20 text-green-400 border-green-500/40",
    thunderbird: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    unicorn: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  };
  const houseLabel = HOUSE_LABEL_MAP[houseKey];

  const prevQuestionIndexRef = useRef(currentQuestionIndex);

  // Resume flow: try loading from session storage when direct visiting /quiz or after reload
  useEffect(() => {
    const ensureState = async () => {
      try {
        if (!state.studentInfo) {
          const raw = sessionStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
          if (raw) {
            const parsed = JSON.parse(raw);
            dispatch({ type: "SET_STUDENT_INFO", payload: parsed });
          }
        }

        if (!state.quizData) {
          const attemptId = sessionStorage.getItem(STORAGE_KEYS.ATTEMPT_ID);
          const status = sessionStorage.getItem(STORAGE_KEYS.ATTEMPT_STATUS);
          const statusUpper = (status || "").toUpperCase();
          const quizRaw = sessionStorage.getItem(STORAGE_KEYS.QUIZ_DATA);

          if (!attemptId || statusUpper !== "ACTIVE" || !quizRaw) {
            toast.error("Không tìm thấy thông tin bài thi", {
              description: "Vui lòng đăng kí lại từ đầu.",
            });
            navigate(ROUTES.REGISTRATION);
            return;
          }

          const parsed = JSON.parse(quizRaw);
          if (!parsed?.questions?.length) {
            toast.error("Không có câu hỏi hợp lệ", {
              description: "Vui lòng thử lại.",
            });
            navigate(ROUTES.REGISTRATION);
            return;
          }

          dispatch({ type: "SET_QUIZ_DATA", payload: parsed });

          const res = await attemptApi.getHistory(attemptId);
          const prefilled = res.result.answers
            .filter((a) => a.option_id)
            .map((a) => ({
              questionId: String(a.question_id),
              optionId: String(a.option_id),
            }));
          if (prefilled.length) {
            dispatch({ type: "SET_ANSWERS", payload: prefilled });
          }
        }

        if (!state.quizStartTime) {
          const storedStart = sessionStorage.getItem(STORAGE_KEYS.QUIZ_START);
          const start =
            storedStart && !Number.isNaN(Number(storedStart))
              ? new Date(Number(storedStart))
              : new Date();
          if (!storedStart) {
            sessionStorage.setItem(
              STORAGE_KEYS.QUIZ_START,
              String(start.getTime())
            );
          }
          dispatch({ type: "START_QUIZ", payload: { startTime: start } });
        }
      } catch (e) {
        console.error("Resume flow failed", e);
        toast.error("Không thể tải bài thi", {
          description: "Vui lòng thử lại.",
        });
        navigate(ROUTES.REGISTRATION);
      }
    };

    ensureState();
  }, [
    dispatch,
    navigate,
    state.quizData,
    state.quizStartTime,
    state.studentInfo,
  ]);

  useEffect(() => {
    const base = state.quizStartTime
      ? state.quizStartTime.getTime()
      : Date.now();
    setElapsed(Math.floor((Date.now() - base) / 1000));
    const timerId = setInterval(() => {
      const effectiveBase = state.quizStartTime
        ? state.quizStartTime.getTime()
        : base;
      setElapsed(Math.floor((Date.now() - effectiveBase) / 1000));
    }, 1000);
    return () => clearInterval(timerId);
  }, [state.quizStartTime]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const submitAnswer = useCallback(
    async (questionId: string, optionId: string) => {
      if (!attemptId) return;

      // Update local state first so UI reflects the choice immediately
      dispatch({
        type: "SET_ANSWER",
        payload: { questionId, optionId },
      });

      try {
        // Return the API promise so callers can await completion when needed
        await answerApi.updateAnswer(attemptId, questionId, optionId);
      } catch (error) {
        toast.error("Lỗi khi lưu câu trả l���i", {
          description:
            "Your progress might not be saved. Please check your connection.",
        });
        console.error("Failed to save answer:", error);
      }
    },
    [attemptId, dispatch]
  );

  useEffect(() => {
    const prevIndex = prevQuestionIndexRef.current;

    if (prevIndex !== currentQuestionIndex) {
      const previousQuestion = questions[prevIndex];
      const existingAnswer = answers.find(
        (a) => a.questionId === String(previousQuestion?.id)
      );

      if (
        previousQuestion &&
        selectedOptionId &&
        selectedOptionId !== existingAnswer?.optionId
      ) {
        submitAnswer(String(previousQuestion.id), selectedOptionId);
      }

      const newCurrentQuestion = questions[currentQuestionIndex];
      if (newCurrentQuestion) {
        const answerForNewQuestion = answers.find(
          (a) => a.questionId === String(newCurrentQuestion.id)
        );
        setSelectedOptionId(answerForNewQuestion?.optionId ?? null);
      }

      prevQuestionIndexRef.current = currentQuestionIndex;
    }
  }, [
    currentQuestionIndex,
    questions,
    answers,
    submitAnswer,
    selectedOptionId,
  ]);

  // Ensure selected option reflects loaded answers (initial load or when answers fetched)
  const currentQuestionId = currentQuestion?.id;
  useEffect(() => {
    if (!currentQuestionId) return;
    const a = answers.find((x) => x.questionId === String(currentQuestionId));
    setSelectedOptionId(a?.optionId ?? null);
  }, [answers, currentQuestionId]);

  const handleAnswerSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: "PREV_QUESTION" });
    }
  };

  const isAllQuestionsAnswered = useMemo(() => {
    const answeredIds = new Set(answers.map((a) => String(a.questionId)));
    if (selectedOptionId && currentQuestion) {
      answeredIds.add(String(currentQuestion.id));
    }
    return answeredIds.size === totalQuestions;
  }, [answers, selectedOptionId, currentQuestion, totalQuestions]);

  const handleNextOrFinish = async () => {
    if (!isLastQuestion) {
      dispatch({ type: "NEXT_QUESTION" });
      return;
    }

    if (!attemptId || isSubmitting) {
      return;
    }

    const lastAnswer = answers.find(
      (a) => a.questionId === String(currentQuestion.id)
    );
    if (selectedOptionId && selectedOptionId !== lastAnswer?.optionId) {
      // Ensure last answer is saved before final submit to avoid race conditions
      await submitAnswer(String(currentQuestion.id), selectedOptionId);
    }

    if (!isAllQuestionsAnswered) {
      toast.error("Bạn phải hoàn thành tất cả câu hỏi trước khi kết thúc.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await answerApi.submitApi(attemptId);

      const serverResult = res.result;

      const quizResult = {
        id: serverResult.id,
        student_id: serverResult.student_id ?? state.studentInfo?.mssv ?? "",
        status: serverResult.status ?? "",
        started_at: serverResult.started_at ?? new Date().toISOString(),
        finished_at: serverResult.finished_at ?? new Date().toISOString(),
        total_count: String(serverResult.total_count ?? "0"),
        correct_count: String(serverResult.correct_count ?? "0"),
        score: Number(serverResult.score ?? 0),
      };

      dispatch({ type: "COMPLETE_QUIZ", payload: quizResult });

      // Clear persisted session when submitted
      sessionStorage.removeItem(STORAGE_KEYS.ATTEMPT_ID);
      sessionStorage.removeItem(STORAGE_KEYS.ATTEMPT_STATUS);
      sessionStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
      sessionStorage.removeItem(STORAGE_KEYS.QUIZ_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.QUIZ_START);

      toast.success("Bài thi hoàn tất!", {
        description: "Đang chuyển bạn đến trang kết quả.",
      });
      navigate(ROUTES.RESULTS);
    } catch (error) {
      toast.error("Không thể nộp bài thi", {
        description: "Vui lòng kiểm tra kết nối và thử lại.",
      });
      console.error("Submit attempt failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!studentInfo || !quizData || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-16 h-16 animate-spin text-amber-500 mb-4" />
        <p>Đang tải bài thi...</p>
      </div>
    );
  }

  const progress =
    totalQuestions > 0 ? (answers.length / totalQuestions) * 100 : 0;
  const isFinishButtonDisabled = isLastQuestion && !isAllQuestionsAnswered;

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={`absolute ${element.color}`}
            style={{ left: `${element.x}%`, top: `${element.y}%` }}
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
                baseSkin={studentInfo.nha}
                config={studentInfo.avatar ?? state.avatar}
                size={48}
                className="border border-slate-600 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {studentInfo.ten}
                  </h1>
                  <span
                    className={`px-2 py-1 rounded-full text-xs border inline-flex items-center ${HOUSE_BADGE_COLORS[houseKey]}`}
                  >
                    {houseLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 rounded-full text-xs bg-slate-700/40 border border-slate-600 text-slate-300 inline-flex items-center gap-1">
                    <Users className="w-3 h-3" /> Lớp {studentInfo.lop}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-slate-700/40 border border-slate-600 text-slate-300 inline-flex items-center gap-1">
                    <Home className="w-3 h-3" /> Đại đội {studentInfo.daiDoi}
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
                Câu {currentQuestionIndex + 1} / {totalQuestions}
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

      {/* Main */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:mt-16 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[360px]">
          {/* Question List Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-slate-800/40 backdrop-blur-xl max-h-[403px] hidden md:flex flex-col rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-[#7D2BB5]/10 to-slate-400/5 rounded-2xl"></div>
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
                  {questions.map((question, index) => {
                    const isAnswered = answers.some(
                      (answer) =>
                        String(answer.questionId) === String(question.id)
                    );
                    const isCurrent = currentQuestionIndex === index;
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1 * (index % 10),
                          duration: 0.3,
                        }}
                        className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 border-2 ${
                          isCurrent
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-white shadow-lg shadow-amber-500/30 cursor-pointer"
                            : isAnswered
                            ? "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 cursor-pointer"
                            : "bg-slate-700/30 border-slate-600/50 text-slate-400 hover:border-amber-400 hover:bg-slate-700/50 cursor-pointer"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          dispatch({
                            type: "SET_QUESTION_INDEX",
                            payload: index,
                          });
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
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
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
                  <span className="font-bold font-clock tabular-nums tracking-wider text-4xl bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7D2BB5]/6 to-transparent"></div>
                <div className="relative z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-2xl font-semibold text-white mb-6 leading-relaxed"
                  >
                    {currentQuestion.content}
                  </motion.h2>

                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <motion.label
                        key={option.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                        whileHover={{
                          scale: 1.02,
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                          selectedOptionId === String(option.id)
                            ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20"
                            : "border-slate-600/50 hover:border-slate-500 bg-slate-700/20 hover:bg-slate-700/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={String(option.id)}
                          checked={selectedOptionId === String(option.id)}
                          onChange={() => handleAnswerSelect(String(option.id))}
                          className="sr-only"
                        />

                        <div
                          className={`w-5 h-5 rounded-full mr-4 border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedOptionId === String(option.id)
                              ? "border-amber-500 bg-amber-500"
                              : "border-slate-400 group-hover:border-slate-300"
                          }`}
                        >
                          {selectedOptionId === String(option.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-slate-200 flex-1 group-hover:text-white transition-colors duration-300">
                          {option.content}
                        </span>
                        {selectedOptionId === String(option.id) && (
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
                {questions.map((question, index) => {
                  const isAnswered = answers.some(
                    (answer) =>
                      String(answer.questionId) === String(question.id)
                  );
                  const isCurrent = currentQuestionIndex === index;
                  return (
                    <button
                      key={question.id}
                      onClick={() => {
                        dispatch({
                          type: "SET_QUESTION_INDEX",
                          payload: index,
                        });
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

      <div className="fixed xl:bottom-36 bottom-1 left-0 right-0 z-20 ">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {currentQuestionIndex > 0 ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="flex cursor-pointer text-lg rounded-lg items-center bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Quay lại</span>
              </Button>
            </motion.div>
          ) : (
            <div />
          )}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleNextOrFinish}
              disabled={isFinishButtonDisabled || isSubmitting}
              className="flex items-center text-lg rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50 py-5 relative overflow-hidden group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Đang nộp bài...</span>
                </>
              ) : (
                <>
                  <span>{isLastQuestion ? "Hoàn thành" : "Tiếp theo"}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
              <div className="absolute cursor-pointer inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
