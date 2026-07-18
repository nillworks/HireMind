import "server-only";
import headersAuthorization from "../headersAuthorization.server";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface AdminOverview {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalRecruiters: number;
}

export const getAdminOverview = async (): Promise<AdminOverview | null> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/admin/analytics/overview`, {
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
};
