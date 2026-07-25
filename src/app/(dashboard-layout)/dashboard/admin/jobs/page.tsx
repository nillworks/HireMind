import type { Metadata } from "next";
import ManageJobsPage from "@/components/DashboardLayoutUi/Admin/ManageJobs/ManageJobsPage";

export const metadata: Metadata = {
  title: "Manage Jobs | HireMind",
  description: "Admin panel to review and manage all job listings.",
};

const ManageJobsRoute = ({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) => {
  return <ManageJobsPage searchParams={searchParams} />;
};

export default ManageJobsRoute;
