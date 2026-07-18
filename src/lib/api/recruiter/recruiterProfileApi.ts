import "server-only";
import headersAuthorization from "../headersAuthorization.server";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface RecruiterProfile {
  _id?: string;
  userId: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companyLocation?: string;
  industry?: string;
  companySize?: string;
  phone?: string;
}

export const getRecruiterProfile = async (): Promise<RecruiterProfile | null> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter-profile/profile`, {
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

export const updateRecruiterProfile = async (
  data: Partial<RecruiterProfile>,
): Promise<boolean> => {
  try {
    const authHeaders = await headersAuthorization();
    const res = await fetch(`${API}/api/recruiter-profile/profile`, {
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
