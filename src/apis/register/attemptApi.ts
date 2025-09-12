import axiosInstance from "../axiosConfig";
import type { Question } from "@/types";

interface GetQuestionsResponse {
  message: string;
  result: {
    status?: string;
    attemptId: string;
    questions: Question[];
  };
}

// For fetching existing answers (history)
export interface HistoryAnswer {
  question_id: string;
  option_id: string | null;
}
export interface GetHistoryResponse {
  message: string;
  result: {
    student_id: string;
    answers: HistoryAnswer[];
  };
}

export const attemptApi = {
  /**
   * Fetches a new set of random questions for a student to attempt.
   * @body data - An object containing the student_id.
   */
  getQuestions: async (data: { student_id: string }) => {
    const response = await axiosInstance.post<GetQuestionsResponse>(
      "/attempt",
      data
    );
    return response.data;
  },

  /**
   * Fetches existing answers for a specific attempt (for reloading page).
   * @param attemptId - The ID of the attempt to fetch.
   */
  getHistory: async (attemptId: string) => {
    const response = await axiosInstance.get<GetHistoryResponse>(
      `/attempt/${attemptId}`
    );
    return response.data;
  },
};
