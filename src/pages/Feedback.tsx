import { useEffect, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquareHeart, Send, Heart, Star, Sparkles } from "lucide-react";
import { useAppContext } from "../context/hooks";
import { ROUTES, STORAGE_KEYS } from "../constants";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { registerApi } from "@/apis/register/registerApi";
import LiquidEther from "@/components/LiquidEther";
import { isAxiosError } from "axios";

interface FeedbackResponse {
  message: string;
  result?: {
    id: string;
    student_id: string;
    comment: string;
    rating: number;
    created_at: string;
  };
  errors?: { [key: string]: string };
}

interface BgParticle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

const BackgroundDecor = memo(function BackgroundDecor({
  particles,
  active,
}: {
  particles: BgParticle[];
  active: boolean;
}) {
  return (
    <>
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-11"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(253, 186, 116, 0.15) 0%, transparent 50%)
            `,
          }}
          animate={{
            background: [
              `radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(253, 186, 116, 0.15) 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 60%, rgba(245, 158, 11, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(253, 186, 116, 0.15) 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
          />
        ))}
      </div>
      {active && (
        <div style={{ width: "100%", height: 1000, position: "absolute" }}>
          <LiquidEther
            colors={["#713f12", "#f97316", "#fbbf24"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={true}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      )}
    </>
  );
});

export default function Feedback() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isHoveringRating, setIsHoveringRating] = useState(false);

  // Check student info
  useEffect(() => {
    if (state.studentInfo) return;
    const raw = sessionStorage.getItem(STORAGE_KEYS.STUDENT_INFO);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        dispatch({ type: "SET_STUDENT_INFO", payload: parsed });
        return;
      } catch {
        // ignore
      }
    }
    // If no student, send to registration
    navigate(ROUTES.REGISTRATION);
  }, [state.studentInfo, dispatch, navigate]);

  const ratingLabels: Record<number, string> = {
    1: "Cần cải thiện",
    2: "Tạm được",
    3: "Khá ổn",
    4: "Rất tốt",
    5: "Xuất sắc",
  };

  const handleSubmit = async () => {
    if (!state.studentInfo) return;
    setSubmitting(true);
    try {
      await registerApi.feedback(state.studentInfo.mssv, {
        rating,
        comment,
      });
      toast.success("Cảm ơn phản hồi của bạn!", {
        description:
          "Chúng mình trân trọng mọi góp ý để cải thiện trải nghiệm.",
      });
      sessionStorage.removeItem(STORAGE_KEYS.STUDENT_INFO);
      navigate(ROUTES.HOME);
    } catch (error) {
      // Check if the error is an Axios error with a response from the backend
      if (isAxiosError(error) && error.response) {
        const responseData: FeedbackResponse = error.response.data;
        if (responseData.errors) {
          // If there are specific validation errors, display them
          Object.values(responseData.errors).forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        } else {
          // No 'errors' field, use the main message
          toast.error("Gửi phản hồi thất bại", {
            description:
              responseData.message || "Đã xảy ra lỗi không xác định.",
          });
        }
      } else {
        // Handle other types of errors (e.g., network error)
        toast.error("Gửi phản hồi thất bại", {
          description: "Vui lòng kiểm tra kết nối và thử lại.",
        });
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
      },
    },
  } as const;

  const bgParticles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      })),
    []
  );

  const buttonParticles = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 1.5,
        delay: Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <BackgroundDecor particles={bgParticles} active={!isHoveringRating} />
      <motion.div
        className="relative z-10 min-h-screen flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main content */}
        <div className="flex flex-grow items-center justify-center px-6 py-8">
          <div className="w-full max-w-2xl">
            {/* Title section */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-6 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(251, 191, 36, 0.35)",
                    "0 0 40px rgba(249, 115, 22, 0.5)",
                    "0 0 20px rgba(251, 191, 36, 0.35)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl pb-0.5 font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Đánh Giá Sự Kiện
              </h1>
              <p className="text-xl text-slate-300 max-w-xl mx-auto">
                Chia sẻ cảm nhận của bạn để giúp chúng mình tạo ra những trải
                nghiệm tuyệt vời hơn
              </p>
            </motion.div>

            {/* Feedback Section */}
            <motion.div
              className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
              variants={itemVariants}
            >
              {/* Rating Section */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <MessageSquareHeart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Chia sẻ cảm nhận
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Góp ý của bạn rất có giá trị
                  </p>
                </div>
              </div>
              <div
                className="text-center mb-8"
                onMouseEnter={() => setIsHoveringRating(true)}
                onMouseLeave={() => setIsHoveringRating(false)}
              >
                {/* Star Rating */}
                <div className="flex justify-center gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="relative cursor-pointer select-none group"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => setRating(star)}
                      aria-label={`Đánh giá ${star} sao`}
                    >
                      <Star
                        className={`w-12 h-12 transform-gpu transition-transform duration-150 ${
                          star <= (hoveredStar || rating)
                            ? "text-yellow-500 fill-yellow-500 drop-shadow-lg"
                            : "text-white/30"
                        } ${hoveredStar === star ? "scale-110" : ""}`}
                      />
                      {star <= (hoveredStar || rating) && (
                        <span className="absolute inset-0 rounded-full bg-yellow-400/30 blur-md transform-gpu transition-transform duration-150 scale-90" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Rating Label */}
                <div className="text-center">
                  <span className="text-2xl font-semibold text-slate-100">
                    {ratingLabels[hoveredStar || rating]}
                  </span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={6}
                    maxLength={500}
                    placeholder="Chia sẻ trải nghiệm, góp ý cải thiện, hoặc lời nhắn gửi đến chúng tôi..."
                    className="w-full rounded-2xl border border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 backdrop-blur-sm resize-none transition-all duration-300"
                  />
                  <div className="absolute bottom-3 right-4 text-xs text-slate-400">
                    {comment.length}/500
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="pt-4 relative w-60 mx-auto"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`button-sparkle-${i}`}
                        className="absolute text-amber-400/60"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${10 + (i % 2) * 60}%`,
                        }}
                        animate={{
                          y: [-8, 8, -8],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.8, 1.2, 0.8],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2,
                        }}
                      >
                        <Sparkles className="w-2 h-2" />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur-xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-60 relative cursor-pointer bg-gradient-to-r text-lg from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 overflow-hidden group shadow-2xl shadow-amber-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 3,
                        }}
                      />

                      <span className="relative z-10 flex items-center justify-center space-x-3">
                        <span className="text-lg tracking-wide">
                          {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                        </span>
                        <motion.div
                          animate={{
                            rotate: [0, -5, 5, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                          whileHover={{ translateX: 5 }}
                        >
                          <Send className="w-6 h-6" />
                        </motion.div>
                      </span>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {buttonParticles.map((p, i) => (
                          <motion.div
                            key={`particle-${i}`}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{ left: `${p.left}%`, top: `${p.top}%` }}
                            animate={{
                              y: [-10, -30, -10],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: p.duration,
                              repeat: Infinity,
                              delay: p.delay,
                              ease: "easeOut",
                            }}
                          />
                        ))}
                      </div>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
