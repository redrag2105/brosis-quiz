import axiosInstance from "../axiosConfig";

interface UpdateAnswerResponse {
  message: string;
}

export const answerApi = {
  /**
   * Submits a user's selected option for a specific question.
   * @param attemptId - The ID of the current quiz attempt.
   * @param questionId - The ID of the question being answered.
   * @param optionId - The ID of the selected option.
   */
  updateAnswer: async (
    attemptId: string,
    questionId: string,
    optionId: string
  ) => {
    const response = await axiosInstance.put<UpdateAnswerResponse>(
      `/attempt/${attemptId}/answer/${questionId}`,
      { option_id: optionId }
    );
    return response.data;
  },

  /**
   * Submits the entire quiz attempt for evaluation.
   * @param attemptId - The ID of the quiz attempt to be submitted.
   */

  submitApi: async (attemptId: string) => {
    const response = await axiosInstance.post<UpdateAnswerResponse>(
      `/attempt/${attemptId}/submit`
    );
    return response.data;
  },
};
