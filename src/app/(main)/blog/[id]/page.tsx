import BlogDetailPage from "@/components/BlogPage/BlogDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post | HireMind",
  description: "Read this article on HireMind.",
};

export default function BlogPost() {
  return <BlogDetailPage />;
}
