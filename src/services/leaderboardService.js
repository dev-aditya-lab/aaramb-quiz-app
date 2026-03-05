import { apiRequest } from "@/services/apiClient";

export function fetchLeaderboard() {
  return apiRequest("/leaderboard");
}