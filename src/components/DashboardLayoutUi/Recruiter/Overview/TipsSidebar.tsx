import React from "react";
import Link from "next/link";
import { Sparkles, BarChart3, ArrowRight } from "lucide-react";

const TipsSidebar = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor p-5 text-white">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 mb-3">
          <Sparkles size={20} />
        </div>
        <h3 className="text-sm font-bold font-PrimaryFont mb-1">
          AI-Powered Recruiting
        </h3>
        <p className="text-xs font-SecondaryFont text-white/80 leading-relaxed">
          Use AI to auto-classify resumes and find the best candidates faster.
        </p>
        <Link
          href="/dashboard/recruiter/resume-classifier"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors"
        >
          Try Now <ArrowRight size={12} />
        </Link>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20">
            <BarChart3 size={16} className="text-SrcPrimaryColor" />
          </div>
          <h3 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
            Pro Tip
          </h3>
        </div>
        <p className="text-xs font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
          Jobs with detailed descriptions and salary ranges get{" "}
          <span className="font-semibold text-PrimaryColor">40% more</span>{" "}
          applications. Fill in all fields for best results.
        </p>
      </div>
    </div>
  );
};

export default TipsSidebar;
