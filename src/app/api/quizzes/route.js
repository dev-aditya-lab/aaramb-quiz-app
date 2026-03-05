import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import quizServiceModule from "../../../../server/services/quizService";

const quizService = quizServiceModule.default || quizServiceModule;

export async function GET() {
  try {
    await requireUser();
    const quizzes = await quizService.listAvailableQuizzes();
    return Response.json({ quizzes });
  } catch (error) {
    return apiErrorResponse(error);
  }
}