import Link from "next/link";
import { Home, ShieldAlert } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

export const metadata = {
  title: "Unauthorized | HireMind",
  description: "You don't have permission to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColor/20 dark:to-SrcPrimaryColor/20">
            <ShieldAlert size={28} className="text-PrimaryColor" />
          </div>
        </div>

        <h1 className="text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight">
          Access <span className="text-SrcPrimaryColor">Denied</span>
        </h1>

        <p className="text-lg font-SecondaryFont text-TextSecondary mt-2">
          You don&apos;t have permission to view this page.
        </p>

        <p className="text-sm font-SecondaryFont text-TextMuted mt-2 max-w-sm mx-auto leading-relaxed">
          This area is restricted to a different account role. If you believe
          this is a mistake, contact support.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            <Home size={16} />
            Go Home
          </Link>
          <GoBackButton className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-Border dark:border-secondary/40 text-TextSecondary dark:text-text-secondary text-sm font-medium font-SecondaryFont hover:bg-BorderLight dark:hover:bg-secondary/10 transition-all" />
        </div>
      </div>
    </div>
  );
}
