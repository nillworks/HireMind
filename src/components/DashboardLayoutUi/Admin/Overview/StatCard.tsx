import React from "react";

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
}: StatCardProps) => {
  return (
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
          {value}
        </p>
      </div>
      <div
        className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
      />
    </div>
  );
};

export default StatCard;
