import axiosInstance from "../axiosConfig";

interface RegisterApiResponse {
  result?: {
    student_id: string;
    full_name: string;
    phone_number: string;
    class_code: string;
    company_unit: string;
    house: string;
    accessory: string;
    shirt: string;
    created_at?: string;
  };
  message?: string | { [key: string]: string };
}

interface FeedbackResponse {
  message: string;
  result?: {
    id: string;
    student_id: string;
    comment: string;
    rating: number;
    created_at: string;
  };
  errors?: { [key: string]: string };
}

export const registerApi = {
  register: async (data: {
    full_name: string;
    student_id: string;
    phone_number: string;
    class_code: string;
    company_unit: string;
  }) => {
    const response = await axiosInstance.post<RegisterApiResponse>(
      "/register",
      data
    );
    return response.data;
  },

  updateInfo: async (data: {
    student_id: string;
    house: string;
    shirt?: string;
    accessory?: string;
  }) => {
    const response = await axiosInstance.post<RegisterApiResponse>(
      "/update",
      data
    );
    return response.data;
  },

  /**
   * Sends feedback from a student.
   * @param param student_id
   * @param data - An object containing rating (1-5) and comment.
   */
  feedback: async (
    student_id: string,
    data: { rating: number; comment: string }
  ) => {
    const response = await axiosInstance.post<FeedbackResponse>(
      `/feedback/${student_id}`,
      data
    );
    return response.data;
  },
};
