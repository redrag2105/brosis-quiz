import type { StudentInfo, AvatarConfig, QuizData, QuizResult } from "../types";

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}
export interface AppState {
  studentInfo: StudentInfo | null;
  quizData: QuizData | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizStartTime: Date | null;
  isQuizCompleted: boolean;
  quizResult: QuizResult | null;
  avatar: AvatarConfig;
}

// Action types
export type AppAction =
  | { type: "SET_STUDENT_INFO"; payload: StudentInfo | null }
  | { type: "SET_AVATAR"; payload: AvatarConfig }
  | { type: "START_QUIZ"; payload: { startTime: Date } }
  | { type: "SET_QUIZ_DATA"; payload: QuizData }
  // Set all answers at once, for loading history
  | { type: "SET_ANSWERS"; payload: QuizAnswer[] }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "SET_QUESTION_INDEX"; payload: number }
  // Set or Update a single answer, for users doing the quiz
  | { type: "SET_ANSWER"; payload: QuizAnswer }
  | { type: "COMPLETE_QUIZ"; payload: QuizResult }
  | { type: "RESET_QUIZ" }
  | { type: "RESET_STATE" };

// Initial state
export const initialState: AppState = {
  studentInfo: null,
  quizData: null,
  currentQuestionIndex: 0,
  answers: [],
  quizStartTime: null,
  isQuizCompleted: false,
  quizResult: null,
  avatar: {
    accessory: "none",
    shirt: "none",
  },
};

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_STUDENT_INFO":
      return {
        ...state,
        studentInfo: action.payload,
      };
    case "SET_AVATAR": {
      const updatedStudent = state.studentInfo
        ? { ...state.studentInfo, avatar: action.payload }
        : state.studentInfo;
      return { ...state, avatar: action.payload, studentInfo: updatedStudent };
    }

    case "SET_QUIZ_DATA":
      return {
        ...state,
        quizData: action.payload,
      };

    case "START_QUIZ":
      return {
        ...state,
        quizStartTime: action.payload.startTime,
        currentQuestionIndex: 0,
        answers: state.answers.length ? state.answers : [],
        isQuizCompleted: false,
      };

    case "NEXT_QUESTION": {
      const totalQuestions = state.quizData?.questions.length ?? 0;
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          totalQuestions - 1
        ),
      };
    }

    case "PREV_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case "SET_QUESTION_INDEX": {
      const maxIdx = Math.max(0, (state.quizData?.questions.length ?? 1) - 1);
      return {
        ...state,
        currentQuestionIndex: Math.max(0, Math.min(action.payload, maxIdx)),
      };
    }

    case "SET_ANSWER": {
      const existingAnswerIndex = state.answers.findIndex(
        (answer) => answer.questionId === action.payload.questionId
      );

      let newAnswers;
      if (existingAnswerIndex >= 0) {
        newAnswers = state.answers.map((answer, index) =>
          index === existingAnswerIndex ? action.payload : answer
        );
      } else {
        newAnswers = [...state.answers, action.payload];
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case "SET_ANSWERS": {
      return {
        ...state,
        answers: action.payload,
      };
    }

    case "COMPLETE_QUIZ":
      return {
        ...state,
        isQuizCompleted: true,
        quizResult: action.payload,
      };

    case "RESET_QUIZ":
      return {
        ...state,
        currentQuestionIndex: 0,
        answers: [],
        quizStartTime: null,
        isQuizCompleted: false,
        quizResult: null,
      };

    case "RESET_STATE":
      return {
        ...initialState,
        quizData: null,
      };

    default:
      return state;
  }
}
