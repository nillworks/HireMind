import fetchClient from "@/lib/utils/fetchClient";

export interface RecommendationInput {
  skills: string[];
  appliedJobs: { title: string; company: string; category: string }[];
  savedJobs: { title: string; company: string; category: string }[];
  preferredLocation?: string;
  preferredJobType?: string;
}

export interface RecommendationResult {
  jobId: string;
  matchScore: number;
  reason: string;
}

export async function getJobRecommendations(
  input: RecommendationInput,
): Promise<{ recommendations: RecommendationResult[]; totalJobs: number }> {
  const res = await fetchClient<{
    success: boolean;
    data: { recommendations: RecommendationResult[]; totalJobs: number };
  }>("/api/ai/recommendations", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data;
}
