"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Target, MessageSquare, FileSearch, ArrowRight } from "lucide-react";

const aiTools = [
  {
    icon: FileText,
    title: "AI Cover Letter Generator",
    description:
      "Generate personalized, professional cover letters tailored to each job application in seconds.",
    color: "PrimaryColor",
    bgColor: "PrimaryColorLight",
    href: "/ai-tools/cover-letter",
  },
  {
    icon: Target,
    title: "Smart Job Recommender",
    description:
      "Get AI-powered job recommendations based on your skills, experience, and career goals.",
    color: "SrcPrimaryColor",
    bgColor: "SrcPrimaryColorLight",
    href: "/ai-tools/recommendations",
  },
  {
    icon: MessageSquare,
    title: "AI Career Coach",
    description:
      "Chat with an intelligent career coach that answers your job search and resume questions.",
    color: "PrimaryColor",
    bgColor: "PrimaryColorLight",
    href: "/ai-tools/career-coach",
  },
  {
    icon: FileSearch,
    title: "Resume Analyzer",
    description:
      "Upload your resume and get instant AI feedback with strengths, weaknesses, and a score out of 100.",
    color: "SrcPrimaryColor",
    bgColor: "SrcPrimaryColorLight",
    href: "/ai-tools/resume-analyzer",
  },
];

const AIToolsShowcase = () => {
  return (
    <section className="py-10 bg-Background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight"
          >
            AI-Powered <span className="text-SrcPrimaryColor">Tools</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Leverage cutting-edge AI to accelerate your job search and career
            growth
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={tool.href} className="block group h-full">
                <div className="h-full p-6 rounded-2xl border border-Border bg-Surface hover:border-PrimaryColor/20 hover:shadow-lg transition-all duration-300">
                  <div
                    className={`w-12 h-12 rounded-xl bg-${tool.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon size={22} className={`text-${tool.color}`} />
                  </div>
                  <h3 className="font-semibold font-PrimaryFont text-TextPrimary mb-2 group-hover:text-PrimaryColor transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm font-SecondaryFont text-TextSecondary leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold font-SecondaryFont text-SrcPrimaryColor group-hover:text-SrcPrimaryColorHover transition-colors">
                    Try Now
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolsShowcase;
