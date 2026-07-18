export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export const jobTypeConfig: Record<string, string> = {
  "full-time":
    "bg-SrcPrimaryColorLight text-SrcPrimaryColor dark:bg-SrcPrimaryColorDark/20 dark:text-SrcPrimaryColor",
  "part-time":
    "bg-PrimaryColorLight text-PrimaryColor dark:bg-PrimaryColorDark/20 dark:text-PrimaryColor",
  remote:
    "bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight text-TextSecondary dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 dark:text-text-secondary",
  contract:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};

export const formatJobType = (jobType: string) =>
  jobType ? jobType.charAt(0).toUpperCase() + jobType.slice(1) : "N/A";

export const formatSalary = (min?: number, max?: number) =>
  `${min ? min.toLocaleString() : "0"} – ${max ? max.toLocaleString() : "0"} BDT`;

export const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
