import { Suspense } from "react";
import { getMyJobs } from "@/lib/api/recruiter/recruiterJobsApi";
import { getRecentApplicants } from "@/lib/api/recruiter/recentApplicantsApi";
import getUserSession from "@/lib/getUserSession";
import OverviewStatsSection from "./OverviewStatsSection";
import OverviewSkeleton from "./OverviewSkeleton";
import OverviewPage from "./OverviewPage";

const RecruiterOverviewPage = async () => {
  const [jobs, user, recentApplicants] = await Promise.all([
    getMyJobs(),
    getUserSession(),
    getRecentApplicants(3),
  ]);

  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewStatsSection />
      <OverviewPage
        jobs={jobs}
        user={user ?? null}
        plan={(user as any)?.plan || "recruiter_free"}
        jobCount={jobs?.length || 0}
        recentApplicants={recentApplicants}
      />
    </Suspense>
  );
};

export default RecruiterOverviewPage;
