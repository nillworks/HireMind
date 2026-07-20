export { generateCoverLetter } from "./coverLetterApi";
export type { CoverLetterInput } from "./coverLetterApi";

export { getJobRecommendations } from "./recommendationsApi";
export type { RecommendationInput, RecommendationResult } from "./recommendationsApi";

export { analyzeResume } from "./resumeAnalyzeApi";
export type { ResumeAnalysis } from "./resumeAnalyzeApi";

export { sendChatMessage, getChatHistory, clearChatHistory } from "./careerCoachApi";
export type { ChatMessage } from "./careerCoachApi";

export { classifyResumes } from "./classifyResumesApi";
export type { ClassifierCandidate, ClassifierResult, ClassifierResponse } from "./classifyResumesApi";
