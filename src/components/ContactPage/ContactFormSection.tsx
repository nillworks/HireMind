"use client";

import { useState } from "react";
import { Send, Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

const ContactFormSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-10 text-center">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-SrcPrimaryColor/10 mb-4">
          <CheckCircle size={32} className="text-SrcPrimaryColor" />
        </div>
        <h3 className="text-xl font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-2">
          Message Sent!
        </h3>
        <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
          Subject
        </label>
        <input
          type="text"
          required
          placeholder="How can we help you?"
          className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium font-SecondaryFont text-TextPrimary dark:text-white mb-1.5">
          Message
        </label>
        <textarea
          required
          rows={5}
          placeholder="Tell us more about your inquiry..."
          className="w-full rounded-xl border border-Border dark:border-secondary bg-BackgroundLight dark:bg-[#0f172a] px-4 py-3 text-sm font-SecondaryFont text-TextPrimary dark:text-white placeholder:text-TextMuted dark:placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-PrimaryColor/50 resize-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-8 py-3.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
      >
        <Send size={16} />
        Send Message
      </button>
    </form>
  );
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "info@hiremind.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+880 123 456 7890",
    sub: "Mon-Fri, 9am-6pm BST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "123 AI Street, Tech City",
    sub: "Dhaka, Bangladesh",
  },
  {
    icon: Clock,
    title: "Working Hours",
    detail: "Mon - Fri: 9am - 6pm",
    sub: "Saturday: 10am - 2pm",
  },
];

const ContactFormSectionWithInfo = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <ContactFormSection />
      </div>
      <div className="space-y-5">
        {contactInfo.map((info) => (
          <div
            key={info.title}
            className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-5 flex items-start gap-4"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10">
              <info.icon size={18} className="text-PrimaryColor dark:text-SrcPrimaryColor" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                {info.title}
              </h4>
              <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary">
                {info.detail}
              </p>
              <p className="text-xs font-SecondaryFont text-TextMuted dark:text-text-muted mt-0.5">
                {info.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactFormSectionWithInfo;
