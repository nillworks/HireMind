import "server-only";
import headersAuthorization from "../headersAuthorization.server";
import type { RecruiterRequest } from "./recruiterRequest.types";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getRecruiterRequests(): Promise<RecruiterRequest[]> {
  try {
    const headers = await headersAuthorization();
    const res = await fetch(`${BASE}/api/admin/recruiter-requests`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!data.success) return [];
    return data.data ?? [];
  } catch {
    return [];
  }
}
