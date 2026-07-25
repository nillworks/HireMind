import type { Metadata } from "next";
import SavedJobsPageComponent from "@/components/SavedJobs/SavedJobsPage";

export const metadata: Metadata = {
  title: "Saved Jobs | HireMind",
  description: "View and manage your saved jobs.",
};

const SavedJobsRoute = () => {
  return <SavedJobsPageComponent />;
};

export default SavedJobsRoute;
