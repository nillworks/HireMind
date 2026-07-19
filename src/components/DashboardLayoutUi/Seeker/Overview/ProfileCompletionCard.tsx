"use client";

import Link from "next/link";
import { User, MapPin, Briefcase, Edit3, ChevronRight } from "lucide-react";
import type { ProfileData } from "@/lib/api/seeker/overviewApi";

interface ProfileCompletionCardProps {
  profile: ProfileData | null;
  completionPercent: number;
  userName: string;
  userImage?: string;
}

const ProfileCompletionCard = ({
  profile,
  completionPercent,
  userName,
  userImage,
}: ProfileCompletionCardProps) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference;

  const getRingColor = () => {
    if (completionPercent >= 80) return "stroke-emerald-500";
    if (completionPercent >= 50) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const getTextColor = () => {
    if (completionPercent >= 80) return "text-emerald-500";
    if (completionPercent >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
          My Profile
        </h3>
        <Link
          href="/dashboard/seeker/profile"
          className="text-xs font-SecondaryFont font-medium text-PrimaryColor hover:underline flex items-center gap-1"
        >
          <Edit3 size={12} />
          Edit
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative shrink-0">
          <div className="size-16 rounded-full overflow-hidden bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 flex items-center justify-center">
            {userImage ? (
              <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold font-PrimaryFont text-PrimaryColor">
                {userName?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-SrcPrimaryColor px-2 py-0.5 text-[9px] font-bold font-SecondaryFont text-white uppercase tracking-wider">
            Seeker
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white truncate">
            {userName || "Unknown User"}
          </p>
          <div className="flex items-center gap-3 mt-1">
            {profile?.location && (
              <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-TextMuted">
                <MapPin size={10} />
                {profile.location}
              </span>
            )}
            {profile?.experience && profile.experience.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-SecondaryFont text-TextMuted">
                <Briefcase size={10} />
                {profile.experience.length} exp
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-BorderLight/50 dark:bg-secondary/10">
        <div className="relative shrink-0">
          <svg className="size-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-Border dark:text-secondary/30"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${getRingColor()} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold font-PrimaryFont ${getTextColor()}`}>
              {completionPercent}%
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-white">
            Profile Completion
          </p>
          <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
            {completionPercent === 100
              ? "Your profile is complete!"
              : completionPercent >= 70
              ? "Almost there! Add a few more details."
              : "Complete your profile to get better job matches."}
          </p>
          <Link
            href="/dashboard/seeker/profile"
            className="inline-flex items-center gap-1 mt-2 text-xs font-semibold font-SecondaryFont text-PrimaryColor hover:underline"
          >
            Improve <ChevronRight size={10} />
          </Link>
        </div>
      </div>

      {profile?.skills && profile.skills.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold font-PrimaryFont text-TextMuted uppercase tracking-wider mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full bg-PrimaryColorLight dark:bg-PrimaryColorDark/20 px-2.5 py-1 text-[10px] font-medium font-SecondaryFont text-PrimaryColor"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 6 && (
              <span className="inline-flex items-center rounded-full bg-BorderLight dark:bg-secondary/20 px-2.5 py-1 text-[10px] font-medium font-SecondaryFont text-TextMuted">
                +{profile.skills.length - 6}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionCard;
