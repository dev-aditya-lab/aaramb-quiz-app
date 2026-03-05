import { requireAdminUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function PATCH(request, { params }) {
  try {
    await requireAdminUser();
    const body = await request.json();
    const user = await adminService.disqualifyUserFromQuiz(params.userId, body.quizId);
    return Response.json({ user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}