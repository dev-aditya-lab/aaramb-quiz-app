import { requireAdminOrManagerUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../server/services/adminService";
import mongoose from "mongoose";

const adminService = adminServiceModule.default || adminServiceModule;

export async function GET(request) {
  try {
    await requireAdminOrManagerUser();
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");
    const status = searchParams.get("status") || "all";
    const mode = searchParams.get("mode") || "default";
    const sortBy = searchParams.get("sortBy") || "latest";

    if (quizId && !mongoose.Types.ObjectId.isValid(quizId)) {
      return Response.json({ message: "Invalid quizId" }, { status: 400 });
    }

    const allowedStatuses = ["all", "joined", "submitted", "disqualified", "expired", "in_progress", "locked"];
    if (!allowedStatuses.includes(status)) {
      return Response.json({ message: "Invalid status filter" }, { status: 400 });
    }

    const allowedModes = ["default", "ranked"];
    if (!allowedModes.includes(mode)) {
      return Response.json({ message: "Invalid export mode" }, { status: 400 });
    }

    const allowedSortBy = ["latest", "oldest", "rank", "score_desc", "score_asc"];
    if (!allowedSortBy.includes(sortBy)) {
      return Response.json({ message: "Invalid sorting option" }, { status: 400 });
    }

    const filters = { quizId: quizId || undefined };

    if (status === "submitted") filters.status = "submitted";
    if (status === "disqualified") filters.status = "disqualified";
    if (status === "expired") filters.status = "expired";
    if (status === "in_progress") filters.status = "in_progress";
    if (status === "locked") filters.isLocked = true;

    if (sortBy === "oldest") filters.sortBy = "oldest";
    if (sortBy === "rank") filters.sortBy = "rank";
    if (sortBy === "score_desc") filters.sortBy = "score_desc";
    if (sortBy === "score_asc") filters.sortBy = "score_asc";

    if (mode === "ranked") {
      filters.status = "submitted";
      filters.sortBy = "rank";
    }

    const rows = await adminService.listResults(filters);
    const csv = mode === "ranked" ? adminService.buildRankedResultsCsv(rows) : adminService.buildResultsCsv(rows);
    const fileDate = new Date().toISOString().slice(0, 10);
    const filePrefix = mode === "ranked" ? "ranked-quiz-results" : "quiz-results";
    const statusPart = status && status !== "all" ? `-${status}` : "";
    const quizPart = quizId ? `-${quizId}` : "";
    const fileName = `${filePrefix}${quizPart}${statusPart}-${fileDate}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}