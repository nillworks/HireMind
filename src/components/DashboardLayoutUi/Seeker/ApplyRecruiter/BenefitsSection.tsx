import { Send, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const benefits = [
  {
    icon: Send,
    title: "Post Unlimited Jobs",
    description: "Reach thousands of qualified candidates instantly",
    color: "text-PrimaryColor",
    bg: "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20",
  },
  {
    icon: Briefcase,
    title: "Manage Applicants",
    description: "Track and organize all applications in one place",
    color: "text-SrcPrimaryColor",
    bg: "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
  },
]

const BenefitsSection = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
      <h3 className="text-base font-semibold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
        Why become a Recruiter?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {benefits.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-3 p-4 rounded-xl bg-Background dark:bg-dark-bg border border-Border/50 dark:border-secondary/50"
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                item.bg
              )}
            >
              <item.icon size={18} className={item.color} />
            </div>
            <div>
              <h4 className="text-sm font-semibold font-PrimaryFont text-TextPrimary dark:text-surface">
                {item.title}
              </h4>
              <p className="text-xs font-SecondaryFont text-TextMuted mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BenefitsSection
