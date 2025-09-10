import axiosInstance from "./axiosConfig";

interface Option {
  id: string;
  content: string;
}

interface Question {
  id: string;
  content: string;
  order: number;
  options: Option[];
}

interface AttemptApiResponse {
  message: string;
  result: {
    attemptId: string;
    questions: Question[];
  };
}

export const attemptApi = {
  getQuestions: async (data: { student_id: string }) => {
    const response = await axiosInstance.post<AttemptApiResponse>(
      "/attempt",
      data
    );
    return response.data;
  },
};
