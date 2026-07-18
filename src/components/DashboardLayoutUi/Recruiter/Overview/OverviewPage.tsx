import React from "react";
import QuickActionsCard from "./QuickActionsCard";
import ActivitySection from "./ActivitySection";
import TipsSidebar from "./TipsSidebar";

const OverviewPage = () => {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <QuickActionsCard />
      <ActivitySection />
      <TipsSidebar />
    </div>
  );
};

export default OverviewPage;
