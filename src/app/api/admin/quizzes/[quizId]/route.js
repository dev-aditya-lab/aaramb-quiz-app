import { requireAdminUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function PATCH(request, { params }) {
  try {
    await requireAdminUser();
    const body = await request.json();
    const quiz = await adminService.updateQuiz(params.quizId, body);
    return Response.json({ quiz });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await requireAdminUser();
    await adminService.deleteQuiz(params.quizId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}