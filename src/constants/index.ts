export const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: 20,
} as const;

export const ROUTES = {
  HOME: "/",
  REGISTRATION: "/registration",
  HOUSE_SELECTION: "/house-selection",
  QUIZ: "/quiz",
  RESULTS: "/results",
  LEADERBOARD: "/leaderboard",
  AVATAR: "/avatar",
} as const;

export const STORAGE_KEYS = {
  ATTEMPT_ID: "attemptId",
  ATTEMPT_STATUS: "attemptStatus",
  STUDENT_INFO: "studentInfo",
  QUIZ_DATA: "quizData",
  QUIZ_START: "quizStart",
} as const;
