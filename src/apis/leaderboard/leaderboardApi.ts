import type {
  GetLeaderboardResponse,
  SearchLeaderboardResponse,
} from "@/types";
import axiosInstance from "../axiosConfig";

export const leaderboardApi = {
  /**
   * Fetches the top 10 leaderboard data.
   */
  getLeaderboard: async () => {
    const response = await axiosInstance.get<GetLeaderboardResponse>(
      `/top-leaderboard`
    );
    return response.data;
  },

  /**
   * Searches for a student's ranking in the leaderboard by their student ID.
   * @param studentId - The student ID to search for.
   */

  searchLeaderboard: async (studentId: string) => {
    const response = await axiosInstance.get<SearchLeaderboardResponse>(
      `/leaderboard/${studentId}`
    );
    return response.data;
  },
};
