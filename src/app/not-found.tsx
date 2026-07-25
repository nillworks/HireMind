import Link from "next/link";
import { Home, Search, Bot, Briefcase } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

export const metadata = {
  title: "404 - Page Not Found | HireMind",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColor/20 dark:to-SrcPrimaryColor/20">
            <Search size={28} className="text-PrimaryColor" />
          </div>
          <div className="p-3 rounded-2xl bg-gradient-to-br from-SrcPrimaryColorLight to-PrimaryColorLight dark:from-SrcPrimaryColor/20 dark:to-PrimaryColor/20">
            <Bot size={28} className="text-SrcPrimaryColor" />
          </div>
        </div>

        <h1 className="text-7xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight">
          <span className="text-PrimaryColor">4</span>
          <span className="text-SrcPrimaryColor">0</span>
          <span className="text-PrimaryColor">4</span>
        </h1>

        <p className="text-lg font-SecondaryFont text-TextSecondary mt-2">
          Oops! This page wandered off.
        </p>

        <p className="text-sm font-SecondaryFont text-TextMuted mt-2 max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            <Home size={16} />
            Go Home
          </Link>
          <GoBackButton className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-Border dark:border-secondary/40 text-TextSecondary dark:text-text-secondary text-sm font-medium font-SecondaryFont hover:bg-BorderLight dark:hover:bg-secondary/10 transition-all" />
        </div>

        <div className="mt-10 pt-8 border-t border-Border dark:border-secondary/40">
          <p className="text-xs font-SecondaryFont text-TextMuted mb-3">Popular destinations</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Link href="/jobs" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-BorderLight dark:bg-secondary/15 text-xs font-medium text-TextSecondary hover:text-PrimaryColor transition-colors">
              <Briefcase size={12} />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
