"use client";

import { useState } from "react";
import {
  Search,
  LayoutGrid,
  List,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { RecruiterRequest } from "@/lib/api/admin/recruiterRequest.types";
import RecruiterRequestCard from "./RecruiterRequestCard";
import RecruiterRequestTable from "./RecruiterRequestTable";

interface RecruiterRequestListProps {
  requests: RecruiterRequest[];
}

const tabs = [
  { key: "all", label: "All", icon: Users },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "approved", label: "Approved", icon: CheckCircle2 },
  { key: "rejected", label: "Rejected", icon: XCircle },
] as const;

const RecruiterRequestList = ({ requests }: RecruiterRequestListProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"card" | "table">("card");

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.company?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-TextMuted"
          />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-Border dark:border-secondary bg-white dark:bg-[#1e293b] text-sm font-SecondaryFont text-TextPrimary dark:text-surface placeholder:text-TextMuted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-Border dark:border-secondary bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => setView("card")}
            className={`flex items-center justify-center size-9 rounded-lg transition-colors cursor-pointer ${
              view === "card"
                ? "bg-white dark:bg-[#1e293b] text-PrimaryColor shadow-sm"
                : "text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center justify-center size-9 rounded-lg transition-colors cursor-pointer ${
              view === "table"
                ? "bg-white dark:bg-[#1e293b] text-PrimaryColor shadow-sm"
                : "text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-Border dark:border-secondary bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.key === "all"
              ? requests.length
              : requests.filter((r) => r.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-SecondaryFont font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-white dark:bg-[#1e293b] text-PrimaryColor shadow-sm"
                  : "text-TextMuted hover:text-TextPrimary dark:hover:text-surface"
              }`}
            >
              <Icon size={14} />
              {tab.label}
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  statusFilter === tab.key
                    ? "bg-PrimaryColor/10 text-PrimaryColor"
                    : "bg-gray-200 dark:bg-gray-700 text-TextMuted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
            <Users size={28} className="text-TextMuted" />
          </div>
          <p className="text-base font-PrimaryFont font-semibold text-TextPrimary dark:text-surface">
            No applications found
          </p>
          <p className="text-sm font-SecondaryFont text-TextMuted mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "No recruiter applications yet."}
          </p>
        </div>
      ) : view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((req) => (
            <RecruiterRequestCard key={req._id} request={req} />
          ))}
        </div>
      ) : (
        <RecruiterRequestTable requests={filtered} />
      )}
    </div>
  );
};

export default RecruiterRequestList;
