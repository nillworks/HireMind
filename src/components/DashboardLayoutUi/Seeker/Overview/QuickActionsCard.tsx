import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  FileText,
  Bookmark,
  Sparkles,
} from "lucide-react";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  lightBg: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Browse Jobs",
    href: "/jobs",
    icon: Search,
    gradient: "from-PrimaryColor to-PrimaryColorDark",
    lightBg: "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20",
    description: "Find your next opportunity",
  },
  {
    label: "My Applications",
    href: "/dashboard/seeker/applications",
    icon: FileText,
    gradient: "from-SrcPrimaryColor to-SrcPrimaryColorDark",
    lightBg: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
    description: "Track your application status",
  },
  {
    label: "Saved Jobs",
    href: "/dashboard/seeker/saved-jobs",
    icon: Bookmark,
    gradient: "from-PrimaryColor to-SrcPrimaryColor",
    lightBg:
      "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20",
    description: "Review your bookmarked jobs",
  },
  {
    label: "AI Career Coach",
    href: "/ai-tools",
    icon: Sparkles,
    gradient: "from-SrcPrimaryColor to-PrimaryColor",
    lightBg: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
    description: "Get AI-powered career advice",
  },
];

const QuickActionsCard = () => {
  return (
    <div>
      <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group relative rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            >
              <div className={`inline-flex p-2.5 rounded-xl ${action.lightBg} mb-3`}>
                <Icon size={18} className="text-TextPrimary dark:text-surface" />
              </div>
              <h4 className="text-sm font-semibold font-SecondaryFont text-TextPrimary dark:text-surface">
                {action.label}
              </h4>
              <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
                {action.description}
              </p>
              <ArrowRight
                size={14}
                className="absolute right-4 bottom-4 text-TextMuted group-hover:text-PrimaryColor group-hover:translate-x-1 transition-all duration-200"
              />
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${action.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCard;
