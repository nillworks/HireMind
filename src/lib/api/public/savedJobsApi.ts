import fetchClient from "@/lib/utils/fetchClient";

export interface SavedJob {
  _id: string;
  jobId: string;
  userId: string;
  createdAt: string;
}

export const toggleSaveJob = async (
  jobId: string
): Promise<{ saved: boolean }> => {
  const res = await fetchClient<{ success: boolean; data: { saved: boolean } }>(
    `/api/saved-jobs/${jobId}`,
    { method: "POST" }
  );
  return res.data;
};

export const checkIfSaved = async (
  jobId: string
): Promise<{ saved: boolean }> => {
  const res = await fetchClient<{ success: boolean; data: { saved: boolean } }>(
    `/api/saved-jobs/check/${jobId}`
  );
  return res.data;
};

export const getSavedJobs = async (): Promise<SavedJob[]> => {
  const res = await fetchClient<{ success: boolean; data: SavedJob[] }>(
    `/api/saved-jobs`
  );
  return res.data ?? [];
};
