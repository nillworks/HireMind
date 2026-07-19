import fetchClient from "@/lib/utils/fetchClient";

export interface ApplicantUser {
  _id: string;
  name: string;
  email: string;
  image: string;
}

export interface Applicant {
  _id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  feedback: string;
  createdAt: string;
  user: ApplicantUser | null;
}

export const getJobApplicants = async (
  jobId: string
): Promise<Applicant[]> => {
  const res = await fetchClient<{ success: boolean; data: Applicant[] }>(
    `/api/recruiter/jobs/${jobId}/applicants`
  );
  return res.data ?? [];
};

export const updateApplicationStatus = async (
  appId: string,
  status: "reviewed" | "accepted" | "rejected",
  feedback?: string
): Promise<{ success: boolean }> => {
  const res = await fetchClient<{ success: boolean }>(
    `/api/recruiter/applications/${appId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, feedback }),
    }
  );
  return { success: res.success };
};
