import { Suspense } from "react";
import OverviewStatsSection from "./OverviewStatsSection";
import OverviewSkeleton from "./OverviewSkeleton";
import OverviewPage from "./OverviewPage";

const RecruiterOverviewPage = () => {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewStatsSection />
      <OverviewPage />
    </Suspense>
  );
};

export default RecruiterOverviewPage;
