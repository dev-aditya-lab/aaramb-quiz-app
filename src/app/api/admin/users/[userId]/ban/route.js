import { requireAdminOrManagerUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function PATCH(request, { params }) {
  try {
    const { userId } = await params;
    const actor = await requireAdminOrManagerUser();
    const body = await request.json();
    const user = await adminService.banUser(userId, Boolean(body.isBanned));

    if (actor.role === "manager") {
      await adminService.createAuditLog({
        actorUserId: actor._id,
        actorRole: actor.role,
        action: "USER_BAN_TOGGLE",
        targetType: "user",
        targetId: userId,
        details: { isBanned: Boolean(body.isBanned) },
      });
    }

    return Response.json({ user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}