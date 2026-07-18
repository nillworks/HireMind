import 'server-only';
import headersAuthorization from '../headersAuthorization.server';

const API = process.env.NEXT_PUBLIC_API_URL;

export interface RecruiterJob {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  category: string;
  jobType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  status: string;
  applicationCount: number;
  createdAt: string;
}

export const postJob = async (
  jobData: Record<string, unknown>,
): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/jobs`, {
      method: 'POST',
      cache: 'no-store',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const getMyJobs = async (): Promise<RecruiterJob[]> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/jobs`, {
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

export const updateJob = async (
  jobId: string,
  updates: Record<string, unknown>,
): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/jobs/${jobId}`, {
      method: 'PATCH',
      cache: 'no-store',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const deleteJob = async (jobId: string): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter/jobs/${jobId}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
};
