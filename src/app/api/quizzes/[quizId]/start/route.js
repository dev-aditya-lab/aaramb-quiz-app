import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import quizServiceModule from "../../../../../../server/services/quizService";

const quizService = quizServiceModule.default || quizServiceModule;

export async function POST(_request, { params }) {
  try {
    const user = await requireUser();
    const attempt = await quizService.startAttempt({
      userId: user._id,
      quizId: params.quizId,
    });
    return Response.json({ attemptId: attempt._id });
  } catch (error) {
    return apiErrorResponse(error);
  }
}