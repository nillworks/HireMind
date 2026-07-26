'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Briefcase, Users, Clock, FileText } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  status: string;
  createdAt: string;
  applicationCount: number;
  type: 'posted' | 'application' | 'status_change';
}

const statusStyles: Record<string, string> = {
  pending:
    'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  approved:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

const activityIcon: Record<string, React.ElementType> = {
  posted: Briefcase,
  application: Users,
  status_change: Clock,
};

const timeAgo = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface RecentActivityProps {
  jobs: {
    _id: string;
    title: string;
    companyName?: string;
    companyLogo: string;
    status: string;
    createdAt: string;
    applicationCount: number;
  }[];
}

const RecentActivity = ({ jobs }: RecentActivityProps) => {
  const toastShown = useRef(false);
  console.log(jobs);

  const activities: Activity[] = jobs
    .filter(j => j.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6)
    .map(j => ({
      id: j._id,
      title: j.title,
      companyName: j.companyName || '',
      companyLogo: j.companyLogo || '',
      status: j.status,
      createdAt: j.createdAt,
      applicationCount: j.applicationCount || 0,
      type: 'posted' as const,
    }));

  const missingLogos = activities.filter(a => !a.companyLogo);
  if (missingLogos.length > 0 && !toastShown.current) {
    toastShown.current = true;
    toast.info('Add company logos to your jobs for better branding.');
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface">
          Recent Activity
        </h3>
        <Link
          href="/dashboard/recruiter/my-jobs"
          className="text-sm font-SecondaryFont font-medium text-PrimaryColor hover:text-PrimaryColorHover dark:text-PrimaryColor transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <FileText size={24} className="text-TextMuted" />
          </div>
          <p className="text-sm font-SecondaryFont text-TextMuted max-w-[240px]">
            No recent activity yet. Post your first job to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity, idx) => {
            const Icon = activityIcon[activity.type] || Briefcase;
            const statusStyle =
              statusStyles[activity.status] ||
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';

            return (
              <div
                key={activity.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                  idx < activities.length - 1
                    ? 'border-b border-gray-100 dark:border-gray-800'
                    : ''
                }`}
              >
                <div className="size-12 rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700 shadow-sm transition-transform duration-200 hover:scale-105">
                  {activity.companyLogo ? (
                    <img
                      src={activity.companyLogo}
                      alt={activity.title}
                      className="size-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-gradient-to-br from-PrimaryColor to-PrimaryColorDark flex items-center justify-center">
                      <span className="text-lg font-bold font-PrimaryFont text-white">
                        {activity.companyName?.charAt(0)?.toUpperCase() || (
                          <Icon size={20} />
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-SecondaryFont font-medium text-TextPrimary dark:text-surface truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs font-SecondaryFont text-TextMuted mt-0.5">
                    {activity.type === 'posted'
                      ? 'Job posted'
                      : activity.type === 'application'
                        ? 'New application'
                        : 'Status updated'}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-[11px] font-SecondaryFont font-medium px-2.5 py-1 rounded-full ${statusStyle}`}
                  >
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </span>
                  <span className="text-xs font-SecondaryFont text-TextMuted whitespace-nowrap">
                    {timeAgo(activity.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
