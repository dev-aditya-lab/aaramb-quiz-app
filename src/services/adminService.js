import { apiRequest } from "@/services/apiClient";

export function fetchAdminStats() {
  return apiRequest("/admin/stats");
}

export function fetchAdminUsers() {
  return apiRequest("/admin/users");
}

export function setUserBan(userId, isBanned) {
  return apiRequest(`/admin/users/${userId}/ban`, {
    method: "PATCH",
    body: JSON.stringify({ isBanned }),
  });
}

export function disqualifyUser(userId, quizId) {
  return apiRequest(`/admin/users/${userId}/disqualify`, {
    method: "PATCH",
    body: JSON.stringify({ quizId }),
  });
}

export function fetchAdminQuizzes() {
  return apiRequest("/admin/quizzes");
}

export function createQuiz(payload) {
  return apiRequest("/admin/quizzes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateQuiz(quizId, payload) {
  return apiRequest(`/admin/quizzes/${quizId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteQuiz(quizId) {
  return apiRequest(`/admin/quizzes/${quizId}`, {
    method: "DELETE",
  });
}