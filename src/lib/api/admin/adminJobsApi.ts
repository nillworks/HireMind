import "server-only";
import headersAuthorization from "../headersAuthorization.server";
import type { AdminJob } from "./jobs.types";

export type { AdminJob };

const API = process.env.NEXT_PUBLIC_API_URL;

export const getAllJobsAdmin = async (
  status?: string,
): Promise<{ jobs: AdminJob[]; totalPages: number }> => {
  try {
    const authHeaders = await headersAuthorization();
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API}/api/admin/jobs${qs}`, {
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
    });
    if (!res.ok) return { jobs: [], totalPages: 1 };
    const json = await res.json();
    return {
      jobs: json.data ?? [],
      totalPages: json.pagination?.totalPages ?? 1,
    };
  } catch {
    return { jobs: [], totalPages: 1 };
  }
};
