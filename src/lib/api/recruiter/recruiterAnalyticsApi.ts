import 'server-only';
import headersAuthorization from '../headersAuthorization.server';

const API = process.env.NEXT_PUBLIC_API_URL;

export interface RecruiterOverview {
  totalJobs: number;
  totalApplications: number;
}

export const getRecruiterOverview = async (): Promise<RecruiterOverview | null> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/analytics/overview`, {
      cache: 'no-store',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
};
