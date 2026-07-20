export interface ResumeAnalysis {
  score: number;
  skills: string[];
  experience: string;
  education: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export async function analyzeResume(
  file?: File,
  resumeText?: string,
): Promise<{ analysis: ResumeAnalysis; wordCount: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
  const { token } = await tokenRes.json();

  const formData = new FormData();
  if (file) {
    formData.append("resume", file);
  }
  if (resumeText) {
    formData.append("resumeText", resumeText);
  }

  const res = await fetch(`${apiUrl}/api/ai/resume-analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to analyze resume");
  }

  const json = await res.json();
  return json.data;
}
