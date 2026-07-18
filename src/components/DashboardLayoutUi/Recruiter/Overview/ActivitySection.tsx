import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

interface ActivityItem {
  icon: React.ElementType;
  text: string;
  time: string;
  color: string;
}

const recentActivity: ActivityItem[] = [
  {
    icon: Clock,
    text: "No recent activity yet. Post your first job to get started!",
    time: "",
    color: "text-TextMuted",
  },
];

const ActivitySection = () => {
  return (
    <div className="mt-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recent Activity
        </h3>
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-xs font-SecondaryFont font-medium text-SrcPrimaryColor hover:text-SrcPrimaryColorHover transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {recentActivity.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-Background dark:bg-dark-bg"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-TextMuted/10">
                <Icon size={16} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySection;
