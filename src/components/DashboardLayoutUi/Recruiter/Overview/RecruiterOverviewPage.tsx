import { Suspense } from "react";
import { getMyJobs } from "@/lib/api/recruiter/recruiterJobsApi";
import getUserSession from "@/lib/getUserSession";
import OverviewStatsSection from "./OverviewStatsSection";
import OverviewSkeleton from "./OverviewSkeleton";
import OverviewPage from "./OverviewPage";

const RecruiterOverviewPage = async () => {
  const [jobs, user] = await Promise.all([getMyJobs(), getUserSession()]);

  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewStatsSection />
      <OverviewPage
        jobs={jobs}
        user={user ?? null}
        plan={(user as any)?.plan || "recruiter_free"}
        jobCount={jobs?.length || 0}
      />
    </Suspense>
  );
};

export default RecruiterOverviewPage;
