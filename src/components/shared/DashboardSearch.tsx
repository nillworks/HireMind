"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  FileText,
  Heart,
  Briefcase,
  Users,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import {
  searchDashboard,
  type SearchCategory,
  type SearchItem,
} from "@/lib/api/dashboard/dashboardSearchApi";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { getSectionsByRole } from "./DashboardSidebar";

const ICON_MAP: Record<string, typeof FileText> = {
  FileText,
  Heart,
  Briefcase,
  Users,
  UserPlus,
  LayoutDashboard,
};

interface DashboardSearchProps {
  userRole: string;
  onNavigate: () => void;
}

const DashboardSearch = ({ userRole, onNavigate }: DashboardSearchProps) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }
    let active = true;
    setLoading(true);
    setIsOpen(true);

    const sections = getSectionsByRole(userRole);
    const ql = debouncedQuery.toLowerCase();
    const navItems: SearchItem[] = [];
    for (const section of sections) {
      for (const item of section.items) {
        if (item.label.toLowerCase().includes(ql)) {
          navItems.push({
            label: item.label,
            sublabel: section.title,
            href: item.href,
          });
        }
      }
    }
    const navCategory: SearchCategory | null =
      navItems.length > 0
        ? { category: "Navigation", categoryIcon: "LayoutDashboard", items: navItems }
        : null;

    searchDashboard(debouncedQuery).then((data) => {
      if (!active) return;
      setResults(navCategory ? [navCategory, ...data] : data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery, userRole]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setIsOpen(false);
      setQuery("");
      onNavigate();
      router.push(item.href);
    },
    [router, onNavigate],
  );

  const totalCount = results.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary shadow-lg p-2">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-PrimaryColor shrink-0" />
        ) : (
          <Search size={16} className="text-PrimaryColor shrink-0" />
        )}
        <input
          type="text"
          placeholder="Search in dashboard..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0 || query.length >= 2) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          className="w-full bg-transparent text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted outline-none"
          autoFocus
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary rounded-xl shadow-xl overflow-hidden z-50"
          >
            {loading && (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-20 rounded bg-BorderLight dark:bg-secondary/20 animate-pulse" />
                    <div className="h-4 w-full rounded bg-BorderLight dark:bg-secondary/20 animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-BorderLight dark:bg-secondary/20 animate-pulse" />
                  </div>
                ))}
              </div>
            )}

            {!loading && totalCount === 0 && (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10 mb-3">
                  <Search size={18} className="text-PrimaryColor" />
                </div>
                <p className="text-sm font-SecondaryFont text-TextMuted">
                  No results for &quot;{query}&quot;
                </p>
                <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
                  Try a different search term
                </p>
              </div>
            )}

            {!loading && totalCount > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {results.map((cat, catIdx) => {
                  const Icon = ICON_MAP[cat.categoryIcon] || FileText;
                  const isOdd = catIdx % 2 === 0;
                  const accentColor = isOdd ? "text-PrimaryColor" : "text-SrcPrimaryColor";
                  const hoverBg = isOdd
                    ? "hover:bg-PrimaryColorLight/50 dark:hover:bg-PrimaryColorDark/10"
                    : "hover:bg-SrcPrimaryColorLight/50 dark:hover:bg-SrcPrimaryColorDark/10";

                  return (
                    <div key={cat.category}>
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs font-semibold font-SecondaryFont uppercase tracking-wider",
                        accentColor,
                        isOdd ? "bg-PrimaryColorLight/20 dark:bg-PrimaryColorDark/5" : "bg-SrcPrimaryColorLight/20 dark:bg-SrcPrimaryColorDark/5",
                      )}>
                        <Icon size={14} />
                        {cat.category}
                      </div>
                      {cat.items.map((item) => (
                        <button
                          key={item._id || item.href}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={cn(
                            "w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer border-b border-Border/50 dark:border-secondary/20 last:border-0",
                            hoverBg,
                          )}
                        >
                          <div className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-lg mt-0.5",
                            isOdd ? "bg-PrimaryColorLight dark:bg-PrimaryColorDark/20" : "bg-SrcPrimaryColorLight dark:bg-SrcPrimaryColorDark/20",
                          )}>
                            <Icon size={14} className={accentColor} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium font-PrimaryFont text-TextPrimary dark:text-surface truncate">
                              {item.label}
                            </p>
                            {item.sublabel && (
                              <p className="text-xs font-SecondaryFont text-TextMuted truncate mt-0.5">
                                {item.sublabel}
                              </p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardSearch;
