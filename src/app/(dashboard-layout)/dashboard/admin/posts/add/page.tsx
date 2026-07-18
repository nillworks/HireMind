import type { Metadata } from "next";
import AddBlogPostPage from "@/components/DashboardLayoutUi/Admin/AddBlogPost/AddBlogPostPage";

export const metadata: Metadata = {
  title: "Add Blog Post | TalentAI Admin",
  description: "Create a new blog post for the TalentAI community.",
};

const AddBlogPostRoute = () => {
  return <AddBlogPostPage />;
};

export default AddBlogPostRoute;
