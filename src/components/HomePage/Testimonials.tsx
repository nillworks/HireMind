"use client";

import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";

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
              className={`relative p-8 rounded-3xl border border-Border bg-Background hover:-translate-y-2 transition-all duration-500 overflow-hidden group hover:shadow-2xl ${
                testimonial.color === "PrimaryColor"
                  ? "hover:shadow-PrimaryColor/10 hover:border-PrimaryColor/30"
                  : "hover:shadow-SrcPrimaryColor/10 hover:border-SrcPrimaryColor/30"
              }`}
            >
              {/* Decorative background glow on hover */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  testimonial.color === "PrimaryColor"
                    ? "bg-gradient-to-b from-PrimaryColor/5 to-transparent"
                    : "bg-gradient-to-b from-SrcPrimaryColor/5 to-transparent"
                }`}
              />

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-Warning text-Warning drop-shadow-sm"
                  />
                ))}
              </div>

              <p className="text-base font-SecondaryFont text-TextSecondary leading-relaxed mb-8 relative z-10">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-Border/60 relative z-10">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className={`w-12 h-12 rounded-full object-cover border-2 ${
                    testimonial.color === "PrimaryColor"
                      ? "border-PrimaryColor/20"
                      : "border-SrcPrimaryColor/20"
                  }`}
                />
                <div>
                  <h4 className="flex items-center gap-1 text-sm font-bold font-PrimaryFont text-TextPrimary">
                    {testimonial.name}
                    <BadgeCheck size={16} className="text-SrcPrimaryColor fill-SrcPrimaryColor/10" />
                  </h4>
                  <p className="text-xs font-SecondaryFont text-TextSecondary mt-0.5">
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
