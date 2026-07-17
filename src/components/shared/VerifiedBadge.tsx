import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

const VerifiedBadge = ({ size = 14, className }: VerifiedBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-SrcPrimaryColor p-[2px]",
        className
      )}
      aria-label="Verified"
    >
      <CheckCircle size={size} className="text-white" strokeWidth={3} />
    </span>
  );
};

export default VerifiedBadge;
