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
      <OverviewPage jobs={jobs} user={user ?? null} />
    </Suspense>
  );
};

export default RecruiterOverviewPage;
