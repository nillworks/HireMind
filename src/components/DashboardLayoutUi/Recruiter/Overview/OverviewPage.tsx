"use client";

import React from "react";
import QuickActionsCard from "./QuickActionsCard";
import ActivitySection from "./ActivitySection";
import TipsSidebar from "./TipsSidebar";
import PlanUpgradeCard from "@/components/DashboardLayoutUi/Seeker/Overview/PlanUpgradeCard";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";

interface OverviewPageProps {
  jobs: RecruiterJob[];
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
  plan?: string;
  jobCount?: number;
}

const OverviewPage = ({ jobs, user, plan = "recruiter_free", jobCount = 0 }: OverviewPageProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <QuickActionsCard />
        <ActivitySection jobs={jobs} user={user} />
        <TipsSidebar />
      </div>
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
