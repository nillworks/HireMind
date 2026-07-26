import 'server-only';
import headersAuthorization from '../headersAuthorization.server';

const API = process.env.NEXT_PUBLIC_API_URL;

export interface RecentApplicant {
  _id: string;
  jobId: string;
  userId: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  jobTitle: string;
  companyName: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
  } | null;
}

export const getRecentApplicants = async (limit = 3): Promise<RecentApplicant[]> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/analytics/recent-applications?limit=${limit}`, {
      cache: 'no-store',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
};
