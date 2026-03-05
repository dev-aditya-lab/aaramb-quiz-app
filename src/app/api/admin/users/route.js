import { requireAdminUser, apiErrorResponse } from "@/lib/apiAuth";
import adminServiceModule from "../../../../../server/services/adminService";

const adminService = adminServiceModule.default || adminServiceModule;

export async function GET() {
  try {
    await requireAdminUser();
    const users = await adminService.listUsers();
    return Response.json({ users });
  } catch (error) {
    return apiErrorResponse(error);
  }
}