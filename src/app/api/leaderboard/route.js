import { requireUser, apiErrorResponse } from "@/lib/apiAuth";
import leaderboardServiceModule from "../../../../server/services/leaderboardService";

const leaderboardService = leaderboardServiceModule.default || leaderboardServiceModule;

export async function GET() {
  try {
    const user = await requireUser();
    const participated = await leaderboardService.hasParticipated(user._id);
    if (!participated) {
      return Response.json({ message: "Participate in at least one quiz to unlock leaderboard" }, { status: 403 });
    }

    const rows = await leaderboardService.getLeaderboardForUser();
    return Response.json({ rows });
  } catch (error) {
    return apiErrorResponse(error);
  }
}