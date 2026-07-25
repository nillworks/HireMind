import { notFound } from "next/navigation";
import { getRecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";
import { EditJobForm } from "@/components/DashboardLayoutUi/Recruiter/MyJobs";

export const metadata = {
  title: "Edit Job | HireMind Recruiter",
  description: "Update your job listing on HireMind",
};

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const job = await getRecruiterJob(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Edit Job
        </h1>
        <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
          Update the details of &quot;{job.title}&quot;
        </p>
      </div>
      <EditJobForm job={job} />
    </div>
  );
}
