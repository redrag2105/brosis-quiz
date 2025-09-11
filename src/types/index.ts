export type House = "faerie" | "phoenix" | "thunderbird" | "unicorn";

export interface AvatarConfig {
  accessory?: string;
  shirt?: string;
}

export interface StudentInfo {
  ten: string;
  mssv: string;
  sdt?: string;
  lop: string;
  nha: House;
  daiDoi: string;
  avatar?: AvatarConfig;
}

// ===== NEW =====
export interface Option {
  id: string;
  content: string;
}
export interface Question {
  id: string;
  content: string;
  order: number;
  options: Option[];
}
export interface QuizData {
  attemptId: string;
  questions: Question[];
}

// =================================
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface QuizResult {
  studentInfo: StudentInfo;
  answers: QuizAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface LeaderboardEntry {
  rank: number;
  studentInfo: StudentInfo;
  score: number;
  timeSpent?: number; // seconds
  completedAt: Date;
}

// =========================== LEADERBOARD ===========================
export interface ApiStudent {
  full_name: string;
  class_code: string;
  company_unit: string;
  house: string;
  shirt?: string;
  accessory?: string;
}

export interface ApiLeaderboardEntry {
  rank: number;
  student_id: string;
  score: number;
  total_ms: number;
  student: ApiStudent;
}

export interface GetLeaderboardResponse {
  message: string;
  result: ApiLeaderboardEntry[];
}

export interface SearchLeaderboardResponse {
  message: string;
  result: ApiLeaderboardEntry;
}
