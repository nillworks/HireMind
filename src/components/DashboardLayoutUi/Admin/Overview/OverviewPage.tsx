import QuickActionsCard from "./QuickActionsCard";
import ActivitySection from "./ActivitySection";

const OverviewPage = () => {
  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <QuickActionsCard />
      <div className="lg:col-span-1 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
        <ActivitySection />
      </div>
    </div>
  );
};

export default OverviewPage;
