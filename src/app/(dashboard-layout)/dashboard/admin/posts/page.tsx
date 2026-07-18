import type { Metadata } from "next";
import BlogPostsPage from "@/components/DashboardLayoutUi/Admin/BlogPosts/BlogPostsPage";

export const metadata: Metadata = {
  title: "Blog Posts | TalentAI Admin",
  description: "Manage all community blog posts on TalentAI.",
};

const BlogPostsRoute = ({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; search?: string }>;
}) => {
  return <BlogPostsPage searchParams={searchParams} />;
};

export default BlogPostsRoute;
