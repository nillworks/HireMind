"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { getJobSuggestions, Suggestion } from "@/lib/api/public/jobsApi";

const TYPE_LABEL: Record<Suggestion["type"], string> = {
  title: "Job Titles",
  company: "Companies",
  category: "Categories",
  location: "Locations",
};

const HeroSection = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [dropdown, setDropdown] = useState({ suggestions: [] as Suggestion[], isOpen: false, loading: false });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setDropdown({ suggestions: [], isOpen: false, loading: false });
      return;
    }
    let active = true;
    (async () => {
      setDropdown((prev) => ({ ...prev, loading: true }));
      const data = await getJobSuggestions(debouncedSearch);
      if (!active) return;
      setDropdown({ suggestions: data, isOpen: true, loading: false });
      setSelectedIndex(-1);
    })();
    return () => { active = false; };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdown((prev) => ({ ...prev, isOpen: false }));
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectSuggestion = useCallback((text: string) => {
    setSearch(text);
    setDropdown({ suggestions: [], isOpen: false, loading: false });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDropdown((prev) => ({ ...prev, isOpen: false }));
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { isOpen, suggestions } = dropdown;
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex].text);
    } else if (e.key === "Escape") {
      setDropdown((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-Background">
      <div className="absolute top-20 left-10 w-72 h-72 bg-PrimaryColorLight rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-SrcPrimaryColorLight rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-PrimaryColorLight/30 to-SrcPrimaryColorLight/30 rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10">
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
            className="mt-10 flex flex-col sm:flex-row gap-3 p-2 bg-Surface rounded-2xl shadow-lg border border-Border max-w-2xl mx-auto"
          >
            <div className="flex-1 relative" ref={inputRef}>
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted z-10"
              />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { if (dropdown.suggestions.length > 0) setDropdown((prev) => ({ ...prev, isOpen: true })); }}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[46px] pl-10 pr-8 py-3 rounded-xl bg-Background border border-Border text-TextPrimary placeholder:text-TextMuted font-SecondaryFont text-sm focus:outline-none focus:border-PrimaryColor focus:ring-1 focus:ring-PrimaryColor/20 transition-colors"
              />
              {dropdown.loading && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-TextMuted animate-spin" />
              )}
              {dropdown.isOpen && debouncedSearch.length >= 2 && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-Surface border border-Border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto"
                >
                  {dropdown.suggestions.length > 0 ? (
                    (["title", "company", "category", "location"] as const).map((type) => {
                      const items = dropdown.suggestions.filter((s) => s.type === type);
                      if (items.length === 0) return null;
                      return (
                        <div key={type}>
                          <div className="px-3 py-2 text-[10px] font-semibold font-SecondaryFont text-TextMuted tracking-wider uppercase bg-BorderLight/50">
                            {TYPE_LABEL[type]}
                          </div>
                          {items.map((s) => {
                            const globalIdx = dropdown.suggestions.indexOf(s);
                            const isSelected = globalIdx === selectedIndex;
                            const isPrimary = (globalIdx % 2 === 0);
                            return (
                              <button
                                key={`${type}-${s.text}`}
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s.text); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm font-SecondaryFont transition-colors ${
                                  isSelected
                                    ? "bg-PrimaryColorLight/40 text-PrimaryColor"
                                    : isPrimary
                                      ? "hover:bg-PrimaryColorLight/20 text-TextPrimary"
                                      : "hover:bg-SrcPrimaryColorLight/20 text-TextPrimary"
                                }`}
                              >
                                <span className={`shrink-0 ${
                                  type === "title" ? "text-PrimaryColor" :
                                  type === "company" ? "text-SrcPrimaryColor" :
                                  type === "category" ? "text-PrimaryColor" :
                                  "text-SrcPrimaryColor"
                                }`}>
                                  {type === "title" && <Briefcase size={14} />}
                                  {type === "company" && <Building2 size={14} />}
                                  {type === "category" && <Tag size={14} />}
                                  {type === "location" && <MapPin size={14} />}
                                </span>
                                <span className="truncate">{s.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  ) : !dropdown.loading ? (
                    <div className="px-3 py-4 text-sm text-TextMuted font-SecondaryFont text-center">
                      No suggestions found
                    </div>
                  ) : null}
                </motion.div>
              )}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            {[
              { label: "React", primary: true },
              { label: "Remote", primary: false },
              { label: "Full Stack", primary: true },
              { label: "Node.js", primary: false },
              { label: "Python", primary: true },
              { label: "UI/UX", primary: false },
            ].map(({ label, primary }) => {
              const hoverText = primary
                ? "hover:text-PrimaryColor hover:border-PrimaryColor/30"
                : "hover:text-SrcPrimaryColor hover:border-SrcPrimaryColor/30";
              return (
                <Link
                  key={label}
                  href={`/jobs?search=${encodeURIComponent(label)}`}
                  className={`px-3 py-1.5 rounded-full bg-BorderLight dark:bg-secondary/15 border border-Border dark:border-secondary/30 text-xs font-medium font-SecondaryFont text-TextSecondary ${hoverText} transition-all duration-300 hover:scale-105 hover:shadow-sm`}
                >
                  {label}
                </Link>
              );
            })}
          </motion.div>

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <span className="block text-xs font-semibold font-SecondaryFont text-TextMuted tracking-wider uppercase mb-3">
              Browse by Category
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-SecondaryFont">
            {[
              { label: "Technology", primary: true },
              { label: "Design", primary: false },
              { label: "Marketing", primary: true },
              { label: "Finance", primary: false },
              { label: "Healthcare", primary: true },
              { label: "Engineering", primary: false },
            ].map(({ label, primary }) => {
              const hoverBg = primary
                ? "hover:bg-PrimaryColorLight hover:text-PrimaryColor hover:border-PrimaryColor/20"
                : "hover:bg-SrcPrimaryColorLight hover:text-SrcPrimaryColor hover:border-SrcPrimaryColor/20";
              return (
                <Link
                  key={label}
                  href={`/jobs?category=${label.toLowerCase()}`}
                  className={`px-3 py-1.5 rounded-lg bg-BorderLight dark:bg-secondary/15 border border-Border dark:border-secondary/30 text-TextMuted font-medium tracking-tight ${hoverBg} transition-all duration-300 hover:scale-105 hover:shadow-sm`}
                >
                  {label}
                </Link>
              );
            })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
