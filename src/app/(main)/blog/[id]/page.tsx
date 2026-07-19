import BlogDetailPage from "@/components/BlogPage/BlogDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post | TalentAI",
  description: "Read this article on TalentAI.",
};

export default function BlogPost() {
  return <BlogDetailPage />;
}
