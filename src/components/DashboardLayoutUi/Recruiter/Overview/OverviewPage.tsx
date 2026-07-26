"use client";

import React from "react";
import QuickActionsCard from "./QuickActionsCard";
import ActivitySection from "./ActivitySection";
import TipsSidebar from "./TipsSidebar";
import RecentApplicants from "./RecentApplicants";
import PlanUpgradeCard from "@/components/DashboardLayoutUi/Seeker/Overview/PlanUpgradeCard";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";
import type { RecentApplicant } from "@/lib/api/recruiter/recentApplicantsApi";

interface OverviewPageProps {
  jobs: RecruiterJob[];
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
  plan?: string;
  jobCount?: number;
  recentApplicants: RecentApplicant[];
}

const OverviewPage = ({ jobs, user, plan = "recruiter_free", jobCount = 0, recentApplicants }: OverviewPageProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <QuickActionsCard />
        <ActivitySection jobs={jobs} />
        <TipsSidebar />
      </div>
      <RecentApplicants applicants={recentApplicants} />
      <div className="max-w-md">
        <PlanUpgradeCard
          currentPlan={plan}
          role="recruiter"
          usage={jobCount}
          limit={5}
        />
      </div>
    </div>
  );
};

export default OverviewPage;
