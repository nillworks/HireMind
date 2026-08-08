"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarDays, CheckCircle2, Loader2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import fetchClient from "@/lib/utils/fetchClient";
import type { AdminUser, UserProfileScore } from "@/lib/api/admin/users.types";

interface UserProfileScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}

const roleLabel: Record<string, string> = {
  admin: "Admin",
  recruiter: "Recruiter",
  seeker: "Seeker",
  user: "User",
};

const UserProfileScoreContent = ({ user }: { user: AdminUser }) => {
  const [data, setData] = useState<UserProfileScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchClient<{ success: boolean; data: UserProfileScore }>(
      `/api/admin/users/${user._id}/profile-score`
    )
      .then((res) => {
        if (cancelled) return;
        setData(res.data ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user._id]);

  const circumference = 2 * Math.PI * 40;
  const score = data?.score ?? 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRingColor = () => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 50) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const getTextColor = () => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getGrade = () => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    if (score > 0) return "Needs Improvement";
    return "Incomplete";
  };

  const getMessage = () => {
    if (!data?.hasProfile) return "This user has not created a profile yet.";
    if (score >= 80) return "This profile is complete and recruiter-ready!";
    if (score >= 50) return "Almost there! A few more details would help.";
    return "Completing the profile will improve job matches.";
  };

  const hasImage =
    user.image &&
    (user.image.startsWith("http://") || user.image.startsWith("https://"));

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      {/* User summary */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10 border border-Border dark:border-secondary p-4">
        <div className="relative shrink-0">
          <div className="size-14 rounded-xl overflow-hidden bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor flex items-center justify-center">
            {hasImage ? (
              <Image
                src={user.image!}
                alt={user.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold font-PrimaryFont text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-SrcPrimaryColor px-2 py-0.5 text-[9px] font-bold font-SecondaryFont text-white uppercase tracking-wider">
            {roleLabel[user.role] || "User"}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface truncate">
            {user.name}
          </p>
          <p className="text-xs font-SecondaryFont text-TextMuted truncate">
            {user.email}
          </p>
          {joinedDate && (
            <p className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-SecondaryFont text-TextMuted">
              <CalendarDays size={11} />
              Joined {joinedDate}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <Loader2 size={28} className="animate-spin text-PrimaryColor" />
          <p className="text-xs font-SecondaryFont text-TextMuted">
            Loading profile score...
          </p>
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <XCircle size={28} className="mx-auto text-red-500 mb-2" />
          <p className="text-sm font-SecondaryFont text-TextMuted">
            Failed to load profile score. Please try again.
          </p>
        </div>
      ) : !data?.hasProfile ? (
        <div className="py-10 text-center">
          <div className="mx-auto size-24 rounded-full bg-BorderLight/50 dark:bg-secondary/10 flex items-center justify-center mb-3">
            <XCircle size={32} className="text-red-400" />
          </div>
          <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface mb-1">
            No Profile Found
          </p>
          <p className="text-xs font-SecondaryFont text-TextMuted">
            This user has not created a profile yet.
          </p>
        </div>
      ) : (
        <>
          {/* Score ring */}
          <div className="flex items-center gap-5 p-5 rounded-2xl bg-BorderLight/50 dark:bg-secondary/10">
            <div className="relative shrink-0">
              <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
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
                <div className="text-center">
                  <span
                    className={`block text-2xl font-bold font-PrimaryFont ${getTextColor()}`}
                  >
                    {score}%
                  </span>
                  <span className="block text-[9px] font-semibold font-SecondaryFont text-TextMuted uppercase tracking-wider">
                    Complete
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold font-SecondaryFont uppercase tracking-wider ${
                  score >= 80
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : score >= 50
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {getGrade()}
              </span>
              <p className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface mt-2">
                Profile Score
              </p>
              <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
                {getMessage()}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          {data.breakdown.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold font-PrimaryFont text-TextMuted uppercase tracking-wider mb-2">
                Profile Fields
              </p>
              <div className="grid grid-cols-2 gap-2">
                {data.breakdown.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-3 py-2"
                  >
                    {field.filled ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-SecondaryFont truncate ${
                        field.filled
                          ? "text-TextPrimary dark:text-surface"
                          : "text-TextMuted"
                      }`}
                    >
                      {field.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const UserProfileScoreDialog = ({
  open,
  onOpenChange,
  user,
}: UserProfileScoreDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-PrimaryFont text-lg">
            Profile Score
          </DialogTitle>
          <DialogDescription className="font-SecondaryFont">
            Profile completion overview for this user
          </DialogDescription>
        </DialogHeader>

        {open && <UserProfileScoreContent key={user._id} user={user} />}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileScoreDialog;
