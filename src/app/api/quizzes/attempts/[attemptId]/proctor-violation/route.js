import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import quizServiceModule from "../../../../../../../server/services/quizService";

const quizService = quizServiceModule.default || quizServiceModule;

export async function POST(request, { params }) {
  try {
    const { attemptId } = await params;
    const user = await requireUser();
    const body = await request.json();
    await quizService.reportProctorViolation({
      userId: user._id,
      attemptId,
      reason: body.reason,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}