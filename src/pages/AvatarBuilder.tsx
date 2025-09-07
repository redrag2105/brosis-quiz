import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, NotebookPen, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/hooks";
import { Button } from "../components/ui/button";
import { Avatar } from "../components/avatar/Avatar";
import type { AvatarConfig, House } from "../types";
import { ROUTES } from "../constants";
import GradientText from "@/components/gradient-text";
import { TextMorph } from "@/components/ui/text-morph";

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

export default function AvatarBuilder() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

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
    const payload = {
      full_name: state.studentInfo.ten,
      mssv: state.studentInfo.mssv,
      phone_number: state.studentInfo.sdt,
      class_code: state.studentInfo.lop,
      company_unit: state.studentInfo.daiDoi,
      house: state.studentInfo.nha,
      accessory: state.avatar.accessory,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const url = (import.meta as any).env?.VITE_SUBMIT_URL as string | undefined;
    try {
      if (url) {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      navigate(ROUTES.QUIZ);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
            className="bg-slate-800/40 mt-23 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 flex flex-col relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7D2BB5]/10 to-transparent rounded-2xl pointer-events-none" />
            {/* Preview */}
            <div className="rounded-xl border-2 border-slate-700/60 p-1 flex items-center justify-center min-h-[240px]">
              <Avatar config={config} baseSkin={selectedHouse} size={300} />
            </div>

            {/* Orange row of 4 houses */}
            <div className="mt-4 rounded-xl border-2 border-orange-400/70 p-3">
              <div className="grid grid-cols-4 gap-3">
                {HOUSES.map((h) => (
                  <button
                    key={h.key}
                    onClick={() => selectHouse(h.key)}
                    className={`rounded-lg cursor-pointer border-2 overflow-hidden bg-slate-700/30 hover:bg-slate-700/50 ${
                      selectedHouse === h.key
                        ? "border-amber-500"
                        : "border-slate-600"
                    }`}
                  >
                    <img
                      src={h.img}
                      alt={h.label}
                      className="w-full h-16 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative name text */}
            <div className="mt-3 text-center">
              {/* <div
                className={`text-2xl font-extrabold bg-clip-text text-transparent drop-shadow-sm bg-gradient-to-r ${nameGradientByHouse[selectedHouse]}`}
              > */}
              <TextMorph
                className={`text-2xl font-extrabold bg-clip-text text-transparent drop-shadow-sm bg-gradient-to-r ${nameGradientByHouse[selectedHouse]}`}
              >
                {HOUSES.find((h) => h.key === selectedHouse)?.label ?? ""}
              </TextMorph>
              {/* </div> */}
            </div>
          </motion.div>

          {/* RIGHT: Accessories grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7D2BB5]/10 to-transparent rounded-2xl pointer-events-none" />
            <h2 className="text-white font-semibold mb-4 flex items-center">
              <Wand2 className="w-4 h-4 mr-2" /> Phụ kiện
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[610px] overflow-auto pr-1">
              {ACCESSORIES.map((a) => (
                <button
                  key={a}
                  onClick={() => update({ accessory: a })}
                  className={`relative cursor-pointer rounded-lg border-2 bg-slate-700/30 hover:bg-slate-700/50 p-2 flex items-center justify-center ${
                    config.accessory === a
                      ? "border-amber-500"
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
                </button>
              ))}
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
            >
              Bắt đầu làm bài
              <NotebookPen className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
