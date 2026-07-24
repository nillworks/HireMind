"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Megaphone,
  TrendingUp,
  Stethoscope,
  GraduationCap,
  Wrench,
  Scale,
} from "lucide-react";

const categories = [
  { name: "Technology", icon: Code, count: 120, color: "PrimaryColor" },
  { name: "Design", icon: Palette, count: 85, color: "SrcPrimaryColor" },
  { name: "Marketing", icon: Megaphone, count: 95, color: "PrimaryColor" },
  { name: "Finance", icon: TrendingUp, count: 70, color: "SrcPrimaryColor" },
  { name: "Healthcare", icon: Stethoscope, count: 60, color: "PrimaryColor" },
  { name: "Education", icon: GraduationCap, count: 55, color: "SrcPrimaryColor" },
  { name: "Engineering", icon: Wrench, count: 110, color: "PrimaryColor" },
  { name: "Legal", icon: Scale, count: 40, color: "SrcPrimaryColor" },
];

const JobCategories = () => {
  return (
    <section className="py-10 bg-Surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight"
          >
            Browse by <span className="text-PrimaryColor">Category</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Explore opportunities across diverse industries and find your perfect
            match
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/jobs?category=${category.name.toLowerCase()}`}
                className="block group"
              >
                <div className="p-5 rounded-2xl border border-Border bg-Background hover:border-PrimaryColor/20 hover:shadow-md transition-all duration-300 text-center">
                  <div
                    className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-${category.color === "PrimaryColor" ? "PrimaryColorLight" : "SrcPrimaryColorLight"} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon
                      size={22}
                      className={`text-${category.color}`}
                    />
                  </div>
                  <h3 className="font-semibold font-PrimaryFont text-TextPrimary text-sm group-hover:text-PrimaryColor transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs font-SecondaryFont text-TextMuted mt-1">
                    {category.count} jobs
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;
