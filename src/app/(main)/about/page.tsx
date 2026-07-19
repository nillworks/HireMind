import AboutPage from "@/components/AboutPage/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TalentAI",
  description:
    "Learn about TalentAI's mission to democratize career growth through AI-powered tools for job seekers and recruiters.",
};

export default function About() {
  return <AboutPage />;
}
