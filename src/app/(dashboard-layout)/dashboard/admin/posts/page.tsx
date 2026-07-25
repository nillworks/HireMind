import type { Metadata } from "next";
import BlogPostsPage from "@/components/DashboardLayoutUi/Admin/BlogPosts/BlogPostsPage";

export const metadata: Metadata = {
  title: "Blog Posts | HireMind Admin",
  description: "Manage all community blog posts on HireMind.",
};

const BlogPostsRoute = ({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; search?: string }>;
}) => {
  return <BlogPostsPage searchParams={searchParams} />;
};

export default BlogPostsRoute;
