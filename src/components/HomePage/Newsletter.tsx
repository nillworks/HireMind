"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubscribed(true);
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="py-20 bg-Background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-PrimaryColorLight rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-SrcPrimaryColorLight rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-SrcPrimaryColorLight border border-SrcPrimaryColor/20 mb-6">
            <Sparkles size={16} className="text-SrcPrimaryColor" />
            <span className="text-sm font-semibold font-SecondaryFont text-SrcPrimaryColor">
              Stay Updated
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight">
            Get Job Alerts &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor">
              Career Tips
            </span>
          </h2>
          <p className="mt-4 font-SecondaryFont text-TextSecondary">
            Subscribe to our newsletter for the latest job opportunities, AI career
            insights, and exclusive tips delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-0 p-2 bg-Surface rounded-xl border border-Border max-w-md mx-auto"
          >
            <div className="flex-1 relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-full min-h-[46px] pl-10 pr-4 py-3 rounded-lg bg-Background text-TextPrimary placeholder:text-TextMuted font-SecondaryFont text-sm focus:outline-none focus:border-PrimaryColor focus:ring-1 focus:ring-PrimaryColor/20 transition-colors"
              />
            </div>
            <Button
              type="submit"
              className="px-6 h-full min-h-[46px] rounded-lg bg-PrimaryColor hover:bg-PrimaryColorHover text-white font-SecondaryFont font-semibold transition-colors cursor-pointer"
            >
              {isSubscribed ? (
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Subscribed
                </span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>

          <p className="mt-4 text-xs font-SecondaryFont text-TextMuted">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
