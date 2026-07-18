import { PostJobForm } from "@/components/DashboardLayoutUi/Recruiter/PostJob";

export const metadata = {
  title: "Post a Job | TalentAI Recruiter",
  description: "Create a new job listing on TalentAI",
};

export default function PostJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Post a New Job
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          Fill in the details below to create a new job listing. It will be reviewed by admin before going live.
        </p>
      </div>
      <PostJobForm />
    </div>
  );
}
