import { Clock, CheckCircle2, XCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusInfo {
  label: string
  icon: LucideIcon
  className: string
  description: string
}

const statusConfig: Record<string, StatusInfo> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    description:
      "Your application is being reviewed by our admin team. We'll notify you once a decision is made.",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    description:
      "Congratulations! Your recruiter application has been approved. You can now post jobs and manage applicants.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className:
      "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
    description:
      "Your application was not approved at this time. You can submit a new application after addressing the feedback.",
  },
}

interface StatusBannerProps {
  status: "pending" | "approved" | "rejected"
  rejectionReason?: string
}

const StatusBanner = ({ status, rejectionReason }: StatusBannerProps) => {
  const info = statusConfig[status]
  if (!info) return null

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-5",
        info.className
      )}
    >
      <info.icon size={24} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold font-PrimaryFont">
          {info.label}
        </h3>
        <p className="text-sm font-SecondaryFont mt-1 opacity-80">
          {info.description}
        </p>
        {status === "rejected" && rejectionReason && (
          <div className="mt-3 p-3 rounded-xl bg-red-100/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50">
            <p className="text-xs font-SecondaryFont font-medium text-red-700 dark:text-red-400 mb-1">
              Reason from admin:
            </p>
            <p className="text-sm font-SecondaryFont text-red-800 dark:text-red-300">
              {rejectionReason}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusBanner
