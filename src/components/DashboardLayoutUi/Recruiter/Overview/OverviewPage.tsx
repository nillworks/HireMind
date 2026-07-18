import React from "react";
import QuickActionsCard from "./QuickActionsCard";
import ActivitySection from "./ActivitySection";
import TipsSidebar from "./TipsSidebar";
import type { RecruiterJob } from "@/lib/api/recruiter/recruiterJobsApi";

interface OverviewPageProps {
  jobs: RecruiterJob[];
  user: {
    name?: string | null;
    image?: string | null;
  } | null;
}

const OverviewPage = ({ jobs, user }: OverviewPageProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <QuickActionsCard />
      <ActivitySection jobs={jobs} user={user} />
      <TipsSidebar />
    </div>
  );
};

export default OverviewPage;
