"use client";

import Link from "next/link";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";

const PaymentCancelPage = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <XCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-3">
        Payment Cancelled
      </h1>
      <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-8">
        No worries! Your payment was not processed. You can try again whenever you&apos;re ready.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/plans"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-6 py-3 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={16} />
          Try Again
        </Link>
        <Link
          href="/dashboard/seeker"
          className="inline-flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-6 py-3 text-sm font-semibold font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
