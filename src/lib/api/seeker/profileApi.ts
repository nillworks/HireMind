import "server-only";
import headersAuthorization from "../headersAuthorization.server";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface SeekerProfile {
  _id?: string;
  userId: string;
  phone?: string;
  bio?: string;
  location?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  skills?: string[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    startDate?: string;
    endDate?: string;
  }[];
  experience?: {
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
}

export const getSeekerProfile = async (): Promise<SeekerProfile | null> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/seeker/profile`, {
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

export const updateSeekerProfile = async (
  data: Partial<SeekerProfile>,
): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/seeker/profile`, {
      method: "PUT",
      cache: "no-store",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
};
