import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { StudentInfo, QuizAnswer, QuizResult } from "../types";

interface AppState {
  studentInfo: StudentInfo | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizResult: QuizResult | null;
  isQuizCompleted: boolean;
}

type AppAction =
  | { type: "SET_STUDENT_INFO"; payload: StudentInfo }
  | { type: "SET_ANSWER"; payload: QuizAnswer }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "COMPLETE_QUIZ"; payload: QuizResult }
  | { type: "RESET_QUIZ" };

const initialState: AppState = {
  studentInfo: null,
  currentQuestionIndex: 0,
  answers: [],
  quizResult: null,
  isQuizCompleted: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_STUDENT_INFO":
      return {
        ...state,
        studentInfo: action.payload,
      };
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
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 20), // 0-based index, max 20
      };
    case "PREV_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    case "COMPLETE_QUIZ":
      return {
        ...state,
        quizResult: action.payload,
        isQuizCompleted: true,
      };
    case "RESET_QUIZ":
      return {
        ...initialState,
        studentInfo: state.studentInfo, // Keep student info
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
