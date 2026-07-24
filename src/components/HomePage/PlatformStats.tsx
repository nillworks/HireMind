"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Users, Building2, FileCheck } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: "PrimaryColor" | "SrcPrimaryColor";
}

const stats: StatItem[] = [
  { label: "Total Jobs", value: 10000, suffix: "+", icon: Briefcase, color: "PrimaryColor" },
  { label: "Active Users", value: 5000, suffix: "+", icon: Users, color: "SrcPrimaryColor" },
  { label: "Companies", value: 2500, suffix: "+", icon: Building2, color: "PrimaryColor" },
  { label: "Applications", value: 50000, suffix: "+", icon: FileCheck, color: "SrcPrimaryColor" },
];

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k` : count.toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
};

const PlatformStats = () => {
  return (
    <section className="py-10 bg-gradient-to-br from-PrimaryColorDarker via-PrimaryColorDark to-SrcPrimaryColorDarker relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-PrimaryColor/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-SrcPrimaryColor/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-white tracking-tight"
          >
            Platform <span className="text-PrimaryColorLight">Statistics</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-white/70 max-w-lg mx-auto"
          >
            Trusted by thousands of job seekers and companies worldwide
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${stat.color === "PrimaryColor" ? "bg-PrimaryColor/20" : "bg-SrcPrimaryColor/20"}`}
              >
                <stat.icon
                  size={22}
                  className={stat.color === "PrimaryColor" ? "text-PrimaryColorLight" : "text-SrcPrimaryColorLight"}
                />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-white">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm font-SecondaryFont text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
