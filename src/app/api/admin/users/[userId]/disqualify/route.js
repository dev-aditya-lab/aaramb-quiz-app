import { requireAdminOrManagerUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function PATCH(request, { params }) {
  try {
    const { userId } = await params;
    const actor = await requireAdminOrManagerUser();
    const body = await request.json();
    const user = await adminService.disqualifyUserFromQuiz(userId, body.quizId);

    if (actor.role === "manager") {
      await adminService.createAuditLog({
        actorUserId: actor._id,
        actorRole: actor.role,
        action: "USER_DISQUALIFY",
        targetType: "user",
        targetId: userId,
        details: { quizId: body.quizId },
      });
    }

    return Response.json({ user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}