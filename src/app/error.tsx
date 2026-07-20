"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw, AlertTriangle, Bot, RefreshCw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-PrimaryColor/15">
            <AlertTriangle size={28} className="text-PrimaryColor" />
          </div>
          <div className="p-3 rounded-2xl bg-green-50 dark:bg-SrcPrimaryColor/15">
            <Bot size={28} className="text-SrcPrimaryColor" />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight">
          <span className="text-PrimaryColor">Some</span>thing{" "}
          <span className="text-SrcPrimaryColor">went</span> wrong
        </h1>

        <p className="text-sm font-SecondaryFont text-TextSecondary mt-3 max-w-sm mx-auto leading-relaxed">
          We encountered an unexpected error. Our team has been notified.
          Please try again or head back home.
        </p>

        {error.digest && (
          <p className="text-xs font-SecondaryFont text-TextMuted mt-3 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor text-white text-sm font-semibold font-SecondaryFont hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-Border dark:border-secondary/40 text-TextSecondary dark:text-text-secondary text-sm font-medium font-SecondaryFont hover:bg-BorderLight dark:hover:bg-secondary/10 transition-all"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
