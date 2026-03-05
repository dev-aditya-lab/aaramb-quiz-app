import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import quizServiceModule from "../../../../../../../server/services/quizService";

const quizService = quizServiceModule.default || quizServiceModule;

export async function GET(_request, { params }) {
  try {
    const user = await requireUser();
    const result = await quizService.getCurrentQuestion({
      userId: user._id,
      attemptId: params.attemptId,
    });
    return Response.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}