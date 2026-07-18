import fetchClient from "@/lib/utils/fetchClient";

export interface RecruiterApplyData {
  name: string;
  company: string;
  userImage?: string;
  companyWebsite?: string;
  description?: string;
  experience?: string;
}

export interface RecruiterApplyResponse {
  message: string;
}

export interface RecruiterStatusResponse {
  status: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
}

export const applyAsRecruiter = async (
  data: RecruiterApplyData
): Promise<RecruiterApplyResponse> => {
  const res = await fetchClient<{
    success: boolean;
    data: RecruiterApplyResponse;
  }>("/api/recruiter/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const getRecruiterApplyStatus =
  async (): Promise<RecruiterStatusResponse> => {
    const res = await fetchClient<{
      success: boolean;
      data: RecruiterStatusResponse;
    }>("/api/recruiter/apply/status");
    return res.data;
  };
