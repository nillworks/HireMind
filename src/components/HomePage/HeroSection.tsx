"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-Background">
      <div className="absolute top-20 left-10 w-72 h-72 bg-PrimaryColorLight rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-SrcPrimaryColorLight rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-PrimaryColorLight/30 to-SrcPrimaryColorLight/30 rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-SrcPrimaryColorLight border border-SrcPrimaryColor/20 mb-6"
          >
            <Sparkles size={16} className="text-SrcPrimaryColor" />
            <span className="text-sm font-semibold font-SecondaryFont text-SrcPrimaryColor">
              AI-Powered Career Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-PrimaryFont tracking-tight text-TextPrimary leading-tight"
          >
            Your AI-Powered{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor">
              Career Partner
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg font-SecondaryFont text-TextSecondary leading-relaxed max-w-xl mx-auto"
          >
            Discover opportunities, get AI-generated cover letters, and advance
            your career with smart recommendations.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch}
            className="mt-10 flex flex-col sm:flex-row gap-0 p-2 bg-Surface rounded-2xl shadow-lg border border-Border max-w-2xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full min-h-[46px] pl-10 pr-4 py-3 rounded-xl bg-Background border border-Border text-TextPrimary placeholder:text-TextMuted font-SecondaryFont text-sm focus:outline-none focus:border-PrimaryColor focus:ring-1 focus:ring-PrimaryColor/20 transition-colors"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-full min-h-[46px] pl-10 pr-4 py-3 rounded-xl bg-Background border border-Border text-TextPrimary placeholder:text-TextMuted font-SecondaryFont text-sm focus:outline-none focus:border-SrcPrimaryColor focus:ring-1 focus:ring-SrcPrimaryColor/20 transition-colors"
              />
            </div>
            <Button
              type="submit"
              className="px-6 h-full min-h-[46px] rounded-xl bg-PrimaryColor hover:bg-PrimaryColorHover text-white font-SecondaryFont font-semibold transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                Search Jobs
                <ArrowRight size={16} />
              </span>
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-SecondaryFont text-TextMuted"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-SrcPrimaryColor" />
              10,000+ Jobs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-PrimaryColor" />
              5,000+ Companies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-SrcPrimaryColor" />
              AI-Powered Matching
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
