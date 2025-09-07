export type House = "faerie" | "phoenix" | "thunderbird" | "unicorn";

export interface AvatarConfig {
  accessory: string;
}

export interface StudentInfo {
  ten: string;
  mssv: string;
  sdt: string;
  lop: string;
  nha: House;
  daiDoi: string;
  avatar?: AvatarConfig;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category?: string;
}

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
