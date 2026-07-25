import BlogPage from "@/components/BlogPage/BlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | HireMind",
  description:
    "Read the latest articles, tips, and insights from the HireMind community on career growth, AI tools, and job search strategies.",
};

export default function Blog() {
  return <BlogPage />;
}
