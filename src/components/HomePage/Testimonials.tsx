"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 5,
    text: "TalentAI completely transformed my job search. The AI cover letter generator saved me hours, and the smart recommendations helped me land my dream role at Google.",
    color: "PrimaryColor",
  },
  {
    name: "Michael Chen",
    role: "HR Manager at Microsoft",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 5,
    text: "As a recruiter, the AI resume classifier is a game-changer. It auto-tags candidates and saves our team countless hours of manual screening. Highly recommend!",
    color: "SrcPrimaryColor",
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at Airbnb",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5,
    text: "The career coach chatbot gave me personalized advice that actually worked. From resume tips to interview prep, TalentAI was with me every step of the way.",
    color: "PrimaryColor",
  },
  {
    name: "David Kim",
    role: "Product Manager at Stripe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
    text: "I applied to 5 companies using TalentAI and got callbacks from 4. The AI-generated cover letters were spot-on and perfectly tailored to each role.",
    color: "SrcPrimaryColor",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-Surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary tracking-tight"
          >
            What People <span className="text-PrimaryColor">Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 font-SecondaryFont text-TextSecondary max-w-lg mx-auto"
          >
            Hear from job seekers and recruiters who transformed their careers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-Border bg-Background hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4">
                <Quote
                  size={24}
                  className={`${testimonial.color === "PrimaryColor" ? "text-PrimaryColor/20" : "text-SrcPrimaryColor/20"}`}
                />
              </div>

              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-Warning text-Warning"
                  />
                ))}
              </div>

              <p className="text-sm font-SecondaryFont text-TextSecondary leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-Border">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold font-PrimaryFont text-TextPrimary">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-SecondaryFont text-TextMuted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
