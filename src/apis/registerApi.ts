import axiosInstance from "./axiosConfig";

interface RegisterApiResponse {
  result?: {
    access_token: string;
    refresh_token: string;
  };
  message: {
    [key: string]: string;
  };
}

export const registerApi = async (data: {
  full_name: string;
  student_id: string;
  phone_number: string;
  class_code: string;
  company_unit: string;
  house: string;
  accessory?: string;
  shirt?: string;
}) => {
  const response = await axiosInstance.post<RegisterApiResponse>(
    "/register",
    data
  );
  return response.data;
};
