import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="p-4 rounded-full bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 dark:from-PrimaryColor/10 dark:to-SrcPrimaryColor/10">
            <Loader2 size={36} className="text-PrimaryColor animate-spin" />
          </div>
          <Sparkles
            size={14}
            className="text-SrcPrimaryColor absolute -top-1 -right-1 animate-pulse"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-SecondaryFont text-TextSecondary animate-pulse">
            Loading<span className="animate-pulse">.</span>
            <span className="animate-pulse delay-150">.</span>
            <span className="animate-pulse delay-300">.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
