import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, NotebookPen, Shirt, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/hooks";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/avatar/Avatar";
import type { AvatarConfig, House } from "../types";
import { ROUTES } from "../constants";
import GradientText from "@/components/gradient-text";
import { TextMorph } from "@/components/ui/text-morph";
import { useForm } from "react-hook-form";
import { registerApi } from "@/apis/registerApi";
import { toast } from "sonner";
import { attemptApi } from "@/apis/attemptApi";

const HOUSES: { key: House; label: string; img: string }[] = [
  { key: "faerie", label: "Faerie", img: "/characters/Skin/faerie.svg" },
  { key: "phoenix", label: "Phoenix", img: "/characters/Skin/phoenix.svg" },
  {
    key: "thunderbird",
    label: "ThunderBird",
    img: "/characters/Skin/thunderbird.svg",
  },
  { key: "unicorn", label: "Unicorn", img: "/characters/Skin/unicorn.svg" },
];

const ACCESSORIES = [
  "none",
  "face1",
  "face2",
  "face3",
  "hat1",
  "hat2",
  "hat3",
  "hat4",
  "hat6",
  "hat7",
  "hat8",
  "hat9",
  "hat10",
  "hat11",
  "hat12",
  "hat13",
  "hat14",
  "hat15",
  "hat16",
  "hat17",
  "hat18",
  "hat19",
  "hat20",
  "hat21",
  "glasses1",
  "glasses2",
  "glasses3",
  "glasses4",
  "glasses5",
  "glasses6",
  "glasses7",
  "glasses8",
  "glasses9",
  "glasses10",
  "scarf1",
  "scarf2",
  "hair1",
  "hair2",
  "shirt1",
  "shirt2",
  "shirt3",
  "shirt4",
] as const;

type AccessoryCategory =
  | "all"
  | "face"
  | "hat"
  | "glasses"
  | "scarf"
  | "hair"
  | "shirt";

type FormData = {
  full_name: string;
  student_id: string;
  phone_number: string;
  class_code: string;
  company_unit: string;
  house: string;
  accessory: string;
  shirt: string;
};

interface ApiError {
  response?: {
    data?: {
      message?: string | { [key: string]: string };
    };
  };
}

export default function AvatarBuilder() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [hoverAcc, setHoverAcc] = useState<string | null>(null);
  const [hoverShirt, setHoverShirt] = useState<string | null>(null);
  const [category, setCategory] = useState<AccessoryCategory>("all");

  const [isProcessing, setIsProcessing] = useState(false);

  const { setError } = useForm<FormData>();

  const config = state.avatar;
  const selectedHouse = state.studentInfo?.nha ?? "faerie";

  const nameGradientByHouse: Record<House, string> = {
    phoenix: "from-yellow-900 via-orange-500 to-amber-400",
    faerie: "from-green-900 via-green-500 to-emerald-100",
    thunderbird: "from-yellow-900 via-yellow-600 to-amber-200",
    unicorn: "from-pink-900 via-fuchsia-500 to-rose-200",
  };

  useEffect(() => {
    if (!state.studentInfo) {
      navigate(ROUTES.REGISTRATION);
    }
  }, [state.studentInfo, navigate]);

  const update = (patch: Partial<AvatarConfig>) => {
    dispatch({ type: "SET_AVATAR", payload: { ...config, ...patch } });
  };

  const selectHouse = (h: House) => {
    if (!state.studentInfo) return;
    dispatch({
      type: "SET_STUDENT_INFO",
      payload: { ...state.studentInfo, nha: h },
    });
  };

  const handleSubmitAll = async () => {
    if (!state.studentInfo) return;
    setIsProcessing(true);

    const registrationPayload = {
      full_name: state.studentInfo.ten,
      student_id: state.studentInfo.mssv,
      phone_number: state.studentInfo.sdt,
      class_code: state.studentInfo.lop,
      company_unit: state.studentInfo.daiDoi,
      house: state.studentInfo.nha.toUpperCase(),
      accessory: state.avatar.accessory,
      shirt: state.avatar.shirt,
    };

    const attemptPayload = {
      student_id: state.studentInfo.mssv,
    };

    try {
      await registerApi(registrationPayload);

      toast.info("Đăng kí thành công!", {
        description: "Đang chuẩn bị bài thi cho bạn...",
      });

      const attemptResponse = await attemptApi.getQuestions(attemptPayload);

      toast.success("Tải bài thi thành công!", {
        description: "Chúc bạn may mắn!",
      });

      dispatch({
        type: "SET_QUIZ_DATA",
        payload: attemptResponse.result,
      });

      navigate(ROUTES.QUIZ);
    } catch (err: unknown) {
      const error = err as ApiError;
      const message = error.response?.data?.message;

      if (typeof message === "object" && message !== null) {
        Object.entries(message).forEach(([field, msg]) => {
          setError(field as keyof FormData, { type: "server", message: msg });
          toast.error("Đăng kí không thành công!", { description: msg });
        });
      } else if (message) {
        toast.error("Đăng kí không thành công!", { description: message });
      } else {
        toast.error("An Error Occurred", {
          description: "Could not connect to the server. Please try again.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const previewConfig = useMemo(
    () => ({
      ...config,
      accessory: hoverAcc ?? config.accessory,
      shirt: hoverShirt ?? config.shirt,
    }),
    [config, hoverAcc, hoverShirt]
  );

  const SHIRTS = useMemo(
    () => ["none", ...ACCESSORIES.filter((a) => a.startsWith("shirt"))],
    []
  );

  const categories: { key: AccessoryCategory; label: string }[] = useMemo(
    () => [
      { key: "all", label: "Tất cả" },
      { key: "face", label: "Mặt" },
      { key: "hat", label: "Mũ" },
      { key: "glasses", label: "Kính" },
      { key: "scarf", label: "Khăn" },
      { key: "hair", label: "Tóc" },
    ],
    []
  );

  const filteredAccessories = useMemo(() => {
    if (category === "all") return ACCESSORIES;
    return ACCESSORIES.filter((a) => a.startsWith(category));
  }, [category]);

  // Randomize both shirt and accessory. Each can be "none". Shirts and accessories are independent.
  const randomize = () => {
    const accessoryPool = ACCESSORIES.filter((a) => !a.startsWith("shirt"));
    const shirtPool = ["none", ...SHIRTS];

    const pickAcc =
      accessoryPool[Math.floor(Math.random() * accessoryPool.length)];
    const pickShirt = shirtPool[Math.floor(Math.random() * shirtPool.length)];

    update({ accessory: pickAcc, shirt: pickShirt });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-32 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-32 h-[26rem] w-[26rem] rounded-full bg-orange-500/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 text-center">
          <GradientText
            colors={["#fbbf24", "#f97316", "#fde047"]}
            animationSpeed={3}
            showBorder={false}
            className="text-3xl font-bold"
          >
            Tuỳ chỉnh Avatar
          </GradientText>

          <p className="text-slate-400 mt-1">
            Chọn nhà và phụ kiện cho nhân vật của bạn
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT: Avatar preview + house picker + label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/40 mt-23.5 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex flex-col relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7D2BB5]/10 to-transparent rounded-2xl pointer-events-none" />
            {/* Preview */}
            <motion.div
              className="rounded-xl border-2 border-slate-700/60 p-1 flex items-center justify-center min-h-[240px]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Avatar
                config={previewConfig}
                baseSkin={selectedHouse}
                size={300}
              />
            </motion.div>

            {/* Orange row of 4 houses */}
            <div className="mt-4 rounded-xl border-2 border-orange-400/70 p-3">
              <div className="grid grid-cols-4 gap-3">
                {HOUSES.map((h) => (
                  <motion.button
                    key={h.key}
                    onClick={() => selectHouse(h.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-lg cursor-pointer border-2 overflow-hidden bg-slate-700/30 hover:bg-slate-700/50 ${
                      selectedHouse === h.key
                        ? "border-amber-500 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]"
                        : "border-slate-600"
                    }`}
                  >
                    <img
                      src={h.img}
                      alt={h.label}
                      className="w-full h-16 object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Decorative name text */}
            <div className="mt-3 text-center">
              <TextMorph
                className={`text-2xl font-extrabold bg-clip-text text-transparent drop-shadow-sm bg-gradient-to-r ${nameGradientByHouse[selectedHouse]}`}
              >
                {HOUSES.find((h) => h.key === selectedHouse)?.label ?? ""}
              </TextMorph>
            </div>
          </motion.div>

          {/* RIGHT: SELECTION GRID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 h-175 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7D2BB5]/10 to-transparent rounded-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center">
                <Shirt className="w-4 h-4 mr-2" /> Áo
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500"
                  onClick={randomize}
                >
                  Ngẫu nhiên
                </Button>
              </div>
            </div>

            {/* =========== SHIRT CATEGORY =========== */}
            <div className="mb-3">
              <div className="grid p-1 grid-cols-4 sm:grid-cols-6 gap-2 mb-7">
                {SHIRTS.map((s) => (
                  <motion.button
                    key={s}
                    onClick={() => update({ shirt: s })}
                    onMouseEnter={() => setHoverShirt(s)}
                    onMouseLeave={() => setHoverShirt(null)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-lg border-2 bg-slate-700/30 hover:bg-slate-700/50 p-2 flex items-center justify-center ${
                      config.shirt === s
                        ? "border-amber-500 shadow-[0_0_0_3px_rgba(251,191,36,0.18)]"
                        : "border-slate-600"
                    }`}
                  >
                    {s === "none" ? (
                      <span className="text-slate-400 text-sm">None</span>
                    ) : (
                      <img
                        src={`/characters/Accessory/${s}.svg`}
                        alt={s}
                        className="h-12 object-contain"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* =========== ACCESSORIES CATEGORY =========== */}
            <h2 className="text-white font-semibold flex items-center mb-4">
              <Wand2 className="w-4 h-4 mr-2" /> Phụ kiện
            </h2>
            {/* Accessories filter */}
            <div className="mb-3 p-1 flex gap-2 overflow-auto pr-1">
              {categories.map((c) => (
                <Button
                  key={c.key}
                  variant={category === c.key ? "secondary" : "outline"}
                  className={`cursor-pointer whitespace-nowrap ${
                    category === c.key
                      ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                      : "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500"
                  }`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                </Button>
              ))}
            </div>

            {/* Accessories grid */}
            <div className="relative">
              <div
                className={`grid grid-cols-3 p-1 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[420px] overflow-auto pr-1`}
              >
                {filteredAccessories
                  .filter((a) => !a.startsWith("shirt"))
                  .map((a) => (
                    <motion.button
                      key={a}
                      onClick={() => update({ accessory: a })}
                      onMouseEnter={() => setHoverAcc(a)}
                      onMouseLeave={() => setHoverAcc(null)}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      title={a}
                      className={`relative cursor-pointer rounded-lg border-2 bg-slate-700/30 hover:bg-slate-700/50 p-2 flex items-center justify-center ${
                        config.accessory === a
                          ? "border-amber-500 shadow-[0_0_0_3px_rgba(251,191,36,0.18)]"
                          : "border-slate-600"
                      }`}
                    >
                      {a === "none" ? (
                        <span className="text-slate-400 text-sm">None</span>
                      ) : (
                        <img
                          src={`/characters/Accessory/${a}.svg`}
                          alt={a}
                          className="h-14 object-contain"
                        />
                      )}
                    </motion.button>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="relative cursor-pointer bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500"
              onClick={() => navigate(ROUTES.REGISTRATION)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl opacity-60" />
            <Button
              className="relative bg-gradient-to-r cursor-pointer from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl"
              onClick={handleSubmitAll}
              disabled={isProcessing} // Disable button while processing
            >
              {isProcessing ? "Đang xử lý..." : "Bắt đầu làm bài"}
              <NotebookPen className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
