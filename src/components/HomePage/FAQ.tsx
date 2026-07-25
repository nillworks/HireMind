"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is HireMind?",
    answer:
      "HireMind is an AI-powered job board and career coaching platform. It helps job seekers discover opportunities, generate AI cover letters, get smart job recommendations, and chat with an AI career coach. Recruiters can post jobs, manage applicants, and use AI to auto-classify resumes.",
  },
  {
    question: "How does the AI Cover Letter Generator work?",
    answer:
      "Simply provide the job title, company name, and your skills/experience. Our AI analyzes the context and generates a personalized, professional cover letter tailored to the specific role. You can adjust the tone (Formal, Friendly, Confident) and length (Short, Medium, Long).",
  },
  {
    question: "Is HireMind free to use?",
    answer:
      "Yes! HireMind offers a generous free tier for job seekers. You can browse jobs, apply, use basic AI tools, and chat with the career coach at no cost. Premium features like advanced resume analysis and unlimited AI generations are available with a subscription.",
  },
  {
    question: "How do I become a recruiter on HireMind?",
    answer:
      "After creating a job seeker account, you can apply to become a recruiter from your dashboard. Submit your company details and our admin team will review your application. Once approved, you can post jobs, manage applicants, and access recruiter-specific AI tools.",
  },
  {
    question: "How does the AI Resume Analyzer work?",
    answer:
      "Upload your resume (PDF, DOCX, or TXT), and our AI will extract key information including skills, experience, and education. It provides a score out of 100 with detailed feedback on strengths, weaknesses, and actionable improvement suggestions.",
  },
  {
    question: "Can I save jobs and track my applications?",
    answer:
      "Absolutely! You can save any job listing to your favorites and track all your applications from your dashboard. Each application shows its current status: Pending, Reviewed, Accepted, or Rejected, so you always know where you stand.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            Frequently Asked <span className="text-SrcPrimaryColor">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Everything you need to know about HireMind
          </motion.p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className={cn(
                  "w-full flex items-center justify-between p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer",
                  openIndex === index
                    ? "bg-PrimaryColorLight border border-PrimaryColor/20"
                    : "bg-Background border border-Border hover:border-PrimaryColor/20"
                )}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    size={18}
                    className={
                      openIndex === index
                        ? "text-PrimaryColor"
                        : "text-TextMuted"
                    }
                  />
                  <span className="font-semibold font-PrimaryFont text-TextPrimary text-sm sm:text-base">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 text-TextMuted transition-transform duration-300",
                    openIndex === index && "rotate-180 text-PrimaryColor"
                  )}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 pt-2 text-sm font-SecondaryFont text-TextSecondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
