import { requireAdminUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function GET() {
  try {
    await requireAdminUser();
    const rows = await adminService.listResults();
    const csv = adminService.buildResultsCsv(rows);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="quiz-results-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}