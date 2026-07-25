"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  bgLight: string;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
  bgLight,
}: StatCardProps) => (
  <div className="relative group rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
    <div className="flex items-start justify-between">
      <div className={`p-2.5 rounded-xl ${bgLight}`}>
        <Icon size={20} className="text-TextPrimary dark:text-surface" />
      </div>
    </div>
    <div className="mt-4">
      <p className="text-xs font-SecondaryFont font-medium text-TextMuted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-bold font-PrimaryFont text-TextPrimary dark:text-surface mt-1">
        {value.toLocaleString()}
      </p>
    </div>
    <div
      className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
    />
  </div>
);

interface AnalyticsChartsProps {
  totalJobs: number;
  totalApplications: number;
  approvedJobs: number;
  pendingJobs: number;
  jobsByStatus: { name: string; value: number; color: string }[];
  jobsByType: { name: string; count: number }[];
  topJobs: { name: string; applications: number }[];
  jobsOverTime: { month: string; count: number }[];
  jobsByCategory: { name: string; count: number }[];
}

const AnalyticsCharts = ({
  totalJobs,
  totalApplications,
  approvedJobs,
  pendingJobs,
  jobsByStatus,
  jobsByType,
  topJobs,
  jobsOverTime,
  jobsByCategory,
}: AnalyticsChartsProps) => {
  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
      gradient: "from-PrimaryColor to-PrimaryColorDark",
      bgLight: "bg-PrimaryColorLight",
    },
    {
      label: "Total Applications",
      value: totalApplications,
      icon: Users,
      gradient: "from-SrcPrimaryColor to-SrcPrimaryColorDark",
      bgLight: "bg-SrcPrimaryColorLight",
    },
    {
      label: "Approved Jobs",
      value: approvedJobs,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Pending Jobs",
      value: pendingJobs,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Row 1: Jobs by Status + Jobs by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Status - Pie Chart */}
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
            Jobs by Status
          </h3>
          {jobsByStatus.length === 0 ? (
            <p className="text-sm font-SecondaryFont text-TextMuted py-10 text-center">
              No job data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={jobsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {jobsByStatus.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontFamily: "var(--font-SecondaryFont)",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontFamily: "var(--font-SecondaryFont)", fontSize: "13px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Jobs by Type - Bar Chart */}
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
            Jobs by Type
          </h3>
          {jobsByType.length === 0 ? (
            <p className="text-sm font-SecondaryFont text-TextMuted py-10 text-center">
              No job data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={jobsByType} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontFamily: "var(--font-SecondaryFont)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="count" fill="#FF6363" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 2: Top Jobs by Applications + Jobs Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Jobs by Applications - Horizontal Bar */}
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
            Top Jobs by Applications
          </h3>
          {topJobs.length === 0 ? (
            <p className="text-sm font-SecondaryFont text-TextMuted py-10 text-center">
              No application data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topJobs} layout="vertical" barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontFamily: "var(--font-SecondaryFont)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="applications" fill="#0F766E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Jobs Over Time - Area Chart */}
        <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
          <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
            Jobs Posted Over Time
          </h3>
          {jobsOverTime.length === 0 ? (
            <p className="text-sm font-SecondaryFont text-TextMuted py-10 text-center">
              No posting data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={jobsOverTime}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6363" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6363" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontFamily: "var(--font-SecondaryFont)",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#FF6363"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorJobs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 3: Jobs by Category */}
      <div className="rounded-2xl bg-white dark:bg-[#1e293b] border border-Border dark:border-secondary p-6">
        <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-surface mb-4">
          Jobs by Category
        </h3>
        {jobsByCategory.length === 0 ? (
          <p className="text-sm font-SecondaryFont text-TextMuted py-10 text-center">
            No category data available.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobsByCategory} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontFamily: "var(--font-SecondaryFont)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fontFamily: "var(--font-SecondaryFont)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontFamily: "var(--font-SecondaryFont)",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {jobsByCategory.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index % 2 === 0 ? "#0F766E" : "#FF6363"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
