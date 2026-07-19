import fetchClient from "@/lib/utils/fetchClient";

export const applyForJob = async (formData: {
  jobId: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await fetchClient<{ success: boolean; data: { message: string } }>(
    "/api/applications",
    {
      method: "POST",
      body: JSON.stringify(formData),
    }
  );
  return { success: res.success, message: res.data.message };
};

export const checkIfApplied = async (
  jobId: string
): Promise<{ applied: boolean }> => {
  const res = await fetchClient<{ success: boolean; data: { applied: boolean } }>(
    `/api/applications/check/${jobId}`
  );
  return res.data;
};

export const getMyApplications = async () => {
  const res = await fetchClient<{ success: boolean; data: unknown[] }>(
    "/api/applications/my"
  );
  return res.data ?? [];
};

export const withdrawApplication = async (
  applicationId: string
): Promise<{ success: boolean }> => {
  const res = await fetchClient<{ success: boolean }>(
    `/api/applications/${applicationId}`,
    { method: "DELETE" }
  );
  return { success: res.success };
};
