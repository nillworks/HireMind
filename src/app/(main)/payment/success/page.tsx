"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, XCircle } from "lucide-react";
import fetchClient from "@/lib/utils/fetchClient";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("No session ID found");
      return;
    }

    const verify = async () => {
      try {
        const data = await fetchClient<{ success: boolean; message?: string }>(
          "/api/payments/confirm",
          {
            method: "POST",
            body: JSON.stringify({ sessionId }),
          }
        );
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Network error. Please try again."
        );
      }
    };

    verify();
  }, [sessionId]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/dashboard/seeker";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  if (status === "verifying") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="text-PrimaryColor animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-3">
          Verifying Payment...
        </h1>
        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-3">
          Payment Issue
        </h1>
        <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-8">
          {message || "Something went wrong."}
        </p>
        <Link
          href="/plans"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-6 py-3 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-emerald-500" />
      </div>
      <h1 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-3">
        Payment Successful!
      </h1>
      <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary mb-8">
        Your plan has been upgraded. Enjoy all the features!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard/seeker"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-6 py-3 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/plans"
          className="inline-flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-6 py-3 text-sm font-semibold font-SecondaryFont text-TextSecondary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors"
        >
          View Plans
        </Link>
      </div>
      <p className="text-xs font-SecondaryFont text-TextMuted mt-6">
        Redirecting in {countdown}s...
      </p>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Loader2 size={40} className="text-PrimaryColor animate-spin mx-auto mb-6" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
