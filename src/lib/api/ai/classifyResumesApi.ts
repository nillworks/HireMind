import fetchClient from "@/lib/utils/fetchClient";

export interface ClassifierCandidate {
  userId: string;
  resumeText: string;
}

export interface ClassifierResult {
  userId: string;
  tags: string[];
  score: number;
}

export interface ClassifierResponse {
  classifications: ClassifierResult[];
  totalProfiles: number;
}

export async function classifyResumes(
  jobTitle: string,
  jobRequirements: string[],
  candidates?: ClassifierCandidate[],
): Promise<ClassifierResponse> {
  const res = await fetchClient<{ success: boolean; data: ClassifierResponse }>(
    "/api/ai/classify-resumes",
    {
      method: "POST",
      body: JSON.stringify({ jobTitle, jobRequirements, candidates }),
    },
  );
  return res.data ?? { classifications: [], totalProfiles: 0 };
}
