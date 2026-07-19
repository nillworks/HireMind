import fetchClient from "@/lib/utils/fetchClient";

export interface ProfileData {
  userId: string;
  phone?: string;
  bio?: string;
  location?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  skills?: string[];
  education?: { institution: string; degree: string; field: string }[];
  experience?: { company: string; position: string }[];
}

export interface ApplicationData {
  _id: string;
  jobId: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  job?: {
    title: string;
    companyName: string;
    companyLogo?: string;
    location?: string;
    jobType?: string;
  } | null;
}

export interface SavedJobData {
  _id: string;
  jobId: string;
  createdAt: string;
}

export const getSeekerProfileClient = async (): Promise<ProfileData | null> => {
  try {
    const res = await fetchClient<{ success: boolean; data: ProfileData }>(
      "/api/seeker/profile"
    );
    return res.data ?? null;
  } catch {
    return null;
  }
};

export const getMyApplicationsClient = async (): Promise<ApplicationData[]> => {
  try {
    const res = await fetchClient<{ success: boolean; data: ApplicationData[] }>(
      "/api/applications/my?limit=50"
    );
    return res.data ?? [];
  } catch {
    return [];
  }
};

export const getSavedJobsClient = async (): Promise<SavedJobData[]> => {
  try {
    const res = await fetchClient<{ success: boolean; data: SavedJobData[] }>(
      "/api/saved-jobs"
    );
    return res.data ?? [];
  } catch {
    return [];
  }
};

export const calculateProfileCompletion = (profile: ProfileData | null): number => {
  if (!profile) return 0;
  const fields = [
    !!profile.phone,
    !!profile.bio,
    !!profile.location,
    !!profile.resumeUrl,
    !!profile.linkedinUrl,
    (profile.skills?.length ?? 0) > 0,
    (profile.education?.length ?? 0) > 0,
    (profile.experience?.length ?? 0) > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};
