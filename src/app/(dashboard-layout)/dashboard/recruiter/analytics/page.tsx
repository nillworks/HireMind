import type { Metadata } from "next";
import { AnalyticsPage } from "@/components/DashboardLayoutUi/Recruiter/Analytics";

export const metadata: Metadata = {
  title: "Analytics | HireMind",
  description: "Recruiter analytics dashboard with job insights and trends.",
};

const AnalyticsRoute = () => {
  return <AnalyticsPage />;
};

export default AnalyticsRoute;
