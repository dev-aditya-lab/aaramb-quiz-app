import { requireAdminOrManagerUser, apiErrorResponse } from "@/lib/apiAuth";
import Attempt from "../../../../../../../server/models/Attempt";
import adminServiceModule from "../../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function PATCH(_request, { params }) {
    try {
        const actor = await requireAdminOrManagerUser();
        const { attemptId } = await params;

        const attempt = await Attempt.findById(attemptId);
        if (!attempt) {
            return Response.json({ message: "Attempt not found" }, { status: 404 });
        }

        const previousStatus = attempt.status;

        attempt.status = "in_progress";
        attempt.isLocked = false;
        attempt.warnings = 0;
        attempt.disqualifyReason = "";
        await attempt.save();

        if (actor.role === "manager") {
            await adminService.createAuditLog({
                actorUserId: actor._id,
                actorRole: actor.role,
                action: "ATTEMPT_UNLOCK",
                targetType: "attempt",
                targetId: attemptId,
                details: { previousStatus },
            });
        }

        return Response.json({ ok: true });
    } catch (error) {
        return apiErrorResponse(error);
    }
}
