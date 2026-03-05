import { requireAdminOrManagerUser, apiErrorResponse } from "@/lib/apiAuth";
import Attempt from "../../../../../../../server/models/Attempt";
import adminServiceModule from "../../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function DELETE(_request, { params }) {
    try {
        const actor = await requireAdminOrManagerUser();
        const { attemptId } = await params;

        const attempt = await Attempt.findByIdAndDelete(attemptId);
        if (!attempt) {
            return Response.json({ message: "Attempt not found" }, { status: 404 });
        }

        if (actor.role === "manager") {
            await adminService.createAuditLog({
                actorUserId: actor._id,
                actorRole: actor.role,
                action: "ATTEMPT_RESET",
                targetType: "attempt",
                targetId: attemptId,
                details: { previousStatus: attempt.status },
            });
        }

        return Response.json({ ok: true });
    } catch (error) {
        return apiErrorResponse(error);
    }
}
