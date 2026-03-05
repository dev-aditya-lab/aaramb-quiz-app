import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import quizServiceModule from "../../../../../../../server/services/quizService";

const quizService = quizServiceModule.default || quizServiceModule;

export async function POST(request, { params }) {
  try {
    const { attemptId } = await params;
    const user = await requireUser();
    const body = await request.json();
    const result = await quizService.submitAnswer({
      userId: user._id,
      attemptId,
      questionId: body.questionId,
      selectedOptionKey: body.selectedOptionKey,
      clientSentAt: body.clientSentAt,
    });
    return Response.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}