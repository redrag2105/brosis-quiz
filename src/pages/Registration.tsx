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
import { useAppContext } from "../context/AppContext";
import {
  studentRegistrationSchema,
  type StudentRegistrationForm,
} from "../lib/validation";
import { ROUTES } from "../constants";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import HouseSelector from "../components/ui/house-selector";

export default function Registration() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegistrationForm>({
    resolver: zodResolver(studentRegistrationSchema),
  });

  const selectedHouse = watch("nha");

  const onSubmit = async (data: StudentRegistrationForm) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch({ type: "SET_STUDENT_INFO", payload: data });
    navigate(ROUTES.QUIZ);
  };

  const formFields = [
    {
      key: "ten",
      label: "Họ và tên",
      placeholder: "Ví dụ: Nguyễn Văn An",
      icon: <User className="w-4 h-4" />,
    },
    {
      key: "mssv",
      label: "Mã số sinh viên",
      placeholder: "Ví dụ: SE161234",
      icon: <School className="w-4 h-4" />,
    },
    {
      key: "sdt",
      label: "Số điện thoại",
      placeholder: "Ví dụ: 0901234567",
      icon: <Phone className="w-4 h-4" />,
    },
    {
      key: "lop",
      label: "Lớp",
      placeholder: "Ví dụ: SE1612",
      icon: <Users className="w-4 h-4" />,
    },
    {
      key: "daiDoi",
      label: "Đại đội",
      placeholder: "Ví dụ: Alpha",
      icon: <Home className="w-4 h-4" />,
    },
  ];

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
                ["cyan", "purple", "blue", "pink"][i]
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
            className="absolute text-cyan-400/30"
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
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl"></div>

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
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              Đăng ký thông tin
            </h1>
            <p className="text-slate-300 text-sm">
              Vui lòng điền đầy đủ thông tin để bắt đầu hành trình khám phá
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Regular form fields */}
            {formFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="space-y-2"
              >
                <Label
                  htmlFor={field.key}
                  className="text-slate-200 flex items-center space-x-2"
                >
                  <span className="text-cyan-400">{field.icon}</span>
                  <span>{field.label} *</span>
                </Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    {...register(field.key as keyof StudentRegistrationForm)}
                    className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 ${
                      errors[field.key as keyof StudentRegistrationForm]
                        ? "border-pink-500"
                        : ""
                    }`}
                  />
                  {errors[field.key as keyof StudentRegistrationForm] && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-400 text-xs mt-1"
                    >
                      {
                        errors[field.key as keyof StudentRegistrationForm]
                          ?.message
                      }
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* House selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="space-y-4"
            >
              <Label className="text-slate-200 flex items-center space-x-2">
                <span className="text-purple-400">🏰</span>
                <span>Chọn nhà của bạn *</span>
              </Label>

              {/* Hidden input for form validation */}
              <input
                type="hidden"
                {...register("nha")}
                value={selectedHouse || ""}
              />

              <HouseSelector
                value={selectedHouse || ""}
                onChange={(value) => setValue("nha", value as any, { shouldValidate: true })}
                error={!!errors.nha}
              />

              {errors.nha && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-pink-400 text-xs"
                >
                  {errors.nha.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        <span>Bắt đầu làm bài thi</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
              className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-all duration-200 flex items-center space-x-2 mx-auto cursor-pointer bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600/50 hover:border-cyan-500/50 backdrop-blur-sm"
              style={{ pointerEvents: 'auto' }}
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
