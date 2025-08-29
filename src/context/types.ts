import type { StudentInfo, QuizAnswer, QuizResult } from '../types';

// Application state interface
export interface AppState {
  studentInfo: StudentInfo | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  quizStartTime: Date | null;
  isQuizCompleted: boolean;
  quizResult: QuizResult | null;
  timeRemaining: number;
}

// Action types
export type AppAction =
  | { type: 'SET_STUDENT_INFO'; payload: StudentInfo }
  | { type: 'START_QUIZ'; payload: { startTime: Date } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_ANSWER'; payload: QuizAnswer }
  | { type: 'COMPLETE_QUIZ'; payload: QuizResult }
  | { type: 'RESET_QUIZ' }
  | { type: 'UPDATE_TIME'; payload: { timeRemaining: number } }
  | { type: 'RESET_STATE' };

// Initial state
export const initialState: AppState = {
  studentInfo: null,
  currentQuestionIndex: 0,
  answers: [],
  quizStartTime: null,
  isQuizCompleted: false,
  quizResult: null,
  timeRemaining: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STUDENT_INFO':
      return {
        ...state,
        studentInfo: action.payload,
      };

    case 'START_QUIZ':
      return {
        ...state,
        quizStartTime: action.payload.startTime,
        currentQuestionIndex: 0,
        answers: [],
        isQuizCompleted: false,
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 20), // Assuming 21 questions (0-20)
      };

    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };

    case 'SET_ANSWER': {
      const existingAnswerIndex = state.answers.findIndex(
        (answer) => answer.questionId === action.payload.questionId
      );

      let newAnswers;
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        newAnswers = state.answers.map((answer, index) =>
          index === existingAnswerIndex ? action.payload : answer
        );
      } else {
        // Add new answer
        newAnswers = [...state.answers, action.payload];
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isQuizCompleted: true,
        quizResult: action.payload,
      };

    case 'RESET_QUIZ':
      return {
        ...state,
        currentQuestionIndex: 0,
        answers: [],
        quizStartTime: null,
        isQuizCompleted: false,
        quizResult: null,
        timeRemaining: 30 * 60 * 1000,
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}
