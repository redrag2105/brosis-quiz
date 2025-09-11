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
};
