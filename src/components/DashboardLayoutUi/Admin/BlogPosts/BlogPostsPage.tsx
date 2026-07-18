import { Suspense } from "react";
import { getAllBlogsAdmin } from "@/lib/api/admin/adminBlogApi";
import BlogPostsTable from "./BlogPostsTable";
import BlogPostsSkeleton from "./BlogPostsSkeleton";

interface BlogPostsPageProps {
  searchParams?: Promise<{ role?: string; search?: string }>;
}

const BlogPostsPage = async ({ searchParams }: BlogPostsPageProps) => {
  const params = await searchParams;
  const blogs = await getAllBlogsAdmin(params?.role, params?.search);

  return (
    <Suspense fallback={<BlogPostsSkeleton />}>
      <BlogPostsTable blogs={blogs} />
    </Suspense>
  );
};

export default BlogPostsPage;
