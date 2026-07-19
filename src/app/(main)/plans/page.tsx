import PlansPage from "@/components/PlansPage/PlansPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans & Pricing | TalentAI",
  description:
    "Choose the right plan for your career. Upgrade to Pro for unlimited applications and AI-powered tools.",
};

export default function Plans() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PlansPage />
    </div>
  );
}
