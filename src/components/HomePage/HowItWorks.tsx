"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Rocket, Briefcase, FileText, CheckCircle } from "lucide-react";

const seekerSteps = [
  { icon: UserPlus, title: "Create Profile", description: "Sign up and build your professional profile with skills and experience" },
  { icon: Search, title: "Find Jobs", description: "Browse AI-recommended jobs that match your skills and career goals" },
  { icon: Rocket, title: "Apply & Grow", description: "Apply with AI-generated cover letters and track your progress" },
];

const recruiterSteps = [
  { icon: Briefcase, title: "Post a Job", description: "Create detailed job listings with requirements and salary ranges" },
  { icon: FileText, title: "Review Applicants", description: "AI auto-classifies and tags resumes for quick candidate review" },
  { icon: CheckCircle, title: "Hire Talent", description: "Connect with top candidates and streamline your hiring process" },
];

const HowItWorks = () => {
  return (
    <section className="py-10 bg-Background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight"
          >
            How It <span className="text-SrcPrimaryColor">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Simple steps to launch your career or find the perfect candidate
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Job Seekers */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-PrimaryColorLight text-PrimaryColor text-sm font-semibold font-SecondaryFont">
                For Job Seekers
              </span>
            </motion.div>

            <div className="space-y-6">
              {seekerSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="flex gap-4 p-5 rounded-2xl bg-Surface border border-Border hover:border-PrimaryColor/20 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-PrimaryColorLight flex items-center justify-center">
                    <step.icon size={22} className="text-PrimaryColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold font-PrimaryFont text-PrimaryColor">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold font-PrimaryFont text-TextPrimary">
                      {step.title}
                    </h3>
                    <p className="text-sm font-SecondaryFont text-TextSecondary mt-1">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recruiters */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-SrcPrimaryColorLight text-SrcPrimaryColor text-sm font-semibold font-SecondaryFont">
                For Recruiters
              </span>
            </motion.div>

            <div className="space-y-6">
              {recruiterSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="flex gap-4 p-5 rounded-2xl bg-Surface border border-Border hover:border-SrcPrimaryColor/20 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-SrcPrimaryColorLight flex items-center justify-center">
                    <step.icon size={22} className="text-SrcPrimaryColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold font-PrimaryFont text-SrcPrimaryColor">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-semibold font-PrimaryFont text-TextPrimary">
                      {step.title}
                    </h3>
                    <p className="text-sm font-SecondaryFont text-TextSecondary mt-1">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
