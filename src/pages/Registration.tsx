import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserPlus,
  ArrowLeft,
  Sparkles,
  User,
  Phone,
  School,
  Home,
  Users,
} from "lucide-react";
import { useAppContext } from "../context/hooks";
import {
  studentRegistrationSchema,
  type StudentRegistrationForm,
} from "../lib/validation";
import { ROUTES } from "../constants";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import type { House } from "../types";

export default function Registration() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<StudentRegistrationForm, "nha">>({
    resolver: zodResolver(studentRegistrationSchema.omit({ nha: true })),
  });

  const onSubmit = async (data: Omit<StudentRegistrationForm, "nha">) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch({
      type: "SET_STUDENT_INFO",
      payload: { ...data, nha: "phoenix" as House },
    });
    navigate(ROUTES.HOUSE_SELECTION);
  };

  const floatingElements = [...Array(8)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ["amber", "orange", "yellow", "red"][i]
              }60 0%, transparent 70%)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${-50 + i * 30}%`,
              top: `${-20 + i * 25}%`,
            }}
            animate={{
              x: [-30, 30, -30],
              y: [-20, 20, -20],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating sparkles */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-amber-400/30"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              scale: element.scale,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + element.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
        >
          {/* Card background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 rounded-3xl"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-3">
              Đăng ký thông tin
            </h1>
            <p className="text-slate-300 text-sm">
              Vui lòng điền đầy đủ thông tin để bắt đầu hành trình khám phá
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Tên and MSSV */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Tên */}
              <div className="space-y-2">
                <Label
                  htmlFor="ten"
                  className="text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-amber-400">
                    <User className="w-4 h-4" />
                  </span>
                  <span>Họ và tên *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="ten"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    {...register("ten")}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.ten ? "border-pink-500" : ""
                    }`}
                  />
                  {errors.ten && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-400 text-xs mt-1"
                    >
                      {errors.ten.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* MSSV */}
              <div className="space-y-2">
                <Label
                  htmlFor="mssv"
                  className="text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-amber-400">
                    <School className="w-4 h-4" />
                  </span>
                  <span>Mã số sinh viên *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="mssv"
                    placeholder="Ví dụ: SE161234"
                    {...register("mssv")}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.mssv ? "border-pink-500" : ""
                    }`}
                  />
                  {errors.mssv && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-400 text-xs mt-1"
                    >
                      {errors.mssv.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Row 2: Số điện thoại */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2"
            >
              <Label
                htmlFor="sdt"
                className="text-slate-200 flex items-center space-x-2"
              >
                <span className="text-amber-400">
                  <Phone className="w-4 h-4" />
                </span>
                <span>Số điện thoại *</span>
              </Label>
              <div className="relative">
                <Input
                  id="sdt"
                  placeholder="Ví dụ: 0901234567"
                  {...register("sdt")}
                  className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20 ${
                    errors.sdt ? "border-pink-500" : ""
                  }`}
                />
                {errors.sdt && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-pink-400 text-xs mt-1"
                  >
                    {errors.sdt.message}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Row 3: Lớp and Đại đội */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Lớp */}
              <div className="space-y-2">
                <Label
                  htmlFor="lop"
                  className="text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-amber-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <span>Lớp *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="lop"
                    placeholder="Ví dụ: SE1612"
                    {...register("lop")}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.lop ? "border-pink-500" : ""
                    }`}
                  />
                  {errors.lop && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-400 text-xs mt-1"
                    >
                      {errors.lop.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Đại đội */}
              <div className="space-y-2">
                <Label
                  htmlFor="daiDoi"
                  className="text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-amber-400">
                    <Home className="w-4 h-4" />
                  </span>
                  <span>Đại đội *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="daiDoi"
                    placeholder="Ví dụ: Alpha"
                    {...register("daiDoi")}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20 ${
                      errors.daiDoi ? "border-pink-500" : ""
                    }`}
                  />
                  {errors.daiDoi && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-400 text-xs mt-1"
                    >
                      {errors.daiDoi.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-4 relative"
            >
              {/* Floating sparkles around button */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`button-sparkle-${i}`}
                    className="absolute text-amber-400/60"
                    style={{
                      left: `${20 + (i * 10)}%`,
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
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Magical glow backdrop */}
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
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative cursor-pointer bg-gradient-to-r text-lg from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 disabled:opacity-50 overflow-hidden group shadow-2xl shadow-amber-500/25"
                >
                  {/* Animated background layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 3,
                    }}
                  />

                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-lg">Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                        <span className="text-lg tracking-wide">Chọn nhà của bạn</span>
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
                        >
                          <Sparkles className="w-6 h-6" />
                        </motion.div>
                      </>
                    )}
                  </span>

                  {/* Magical particle effects on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          </form>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 text-center relative z-20"
          >
            <motion.button
              whileHover={{ x: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(ROUTES.HOME)}
              className="text-slate-400 hover:text-amber-400 text-sm font-medium transition-all duration-200 flex items-center space-x-2 mx-auto cursor-pointer bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50 hover:border-amber-500/50 backdrop-blur-sm"
              style={{ pointerEvents: "auto" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay về trang chủ</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
