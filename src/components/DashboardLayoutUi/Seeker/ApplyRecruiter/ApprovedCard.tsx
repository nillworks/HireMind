import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

const ApprovedCard = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-SrcPrimaryColorLight to-SrcPrimaryColorLight dark:from-SrcPrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 mx-auto mb-4">
        <CheckCircle2 size={28} className="text-SrcPrimaryColor" />
      </div>
      <h3 className="text-lg font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
        You&apos;re a Recruiter!
      </h3>
      <p className="text-sm font-SecondaryFont text-TextMuted mt-2 max-w-md mx-auto">
        Your account has been upgraded to Recruiter. You can now post jobs,
        manage applicants, and access the full recruiter dashboard.
      </p>
      <Link
        href="/dashboard/recruiter"
        className="inline-flex items-center gap-2 mt-6 h-10 px-6 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:opacity-90 transition-opacity cursor-pointer"
      >
        Go to Recruiter Dashboard
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export default ApprovedCard
