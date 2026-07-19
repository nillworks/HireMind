import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyJobs } from "@/lib/api/recruiter/recruiterJobsApi";
import getUserSession from "@/lib/getUserSession";
import JobList from "./JobList";
import MyJobsSkeleton from "./MyJobsSkeleton";
import PlanUsageBar from "@/components/shared/PlanUsageBar";

const MyJobsContent = async () => {
  const [jobs, user] = await Promise.all([getMyJobs(), getUserSession()]);
  const plan = (user as any)?.plan || "recruiter_free";
  const jobCount = jobs?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
            My Jobs
          </h1>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
            Manage and track all your posted job listings.
          </p>
        </div>
        <Link href="/dashboard/recruiter/post-job">
          <Button
            type="button"
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor hover:from-PrimaryColorHover hover:to-SrcPrimaryColorHover text-white font-SecondaryFont font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            Post Job
          </Button>
        </Link>
      </div>

      <PlanUsageBar plan={plan} role="recruiter" usage={jobCount} limit={5} />

      <JobList initialJobs={jobs} />
    </div>
  );
};

const MyjobsPage = () => {
  return (
    <Suspense fallback={<MyJobsSkeleton />}>
      <MyJobsContent />
    </Suspense>
  );
};

export default MyjobsPage;
