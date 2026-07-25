import { Sparkles, Target, Eye, Users, BarChart3, Globe, Heart, Shield, Lightbulb } from "lucide-react";

const teamMembers = [
  {
    name: "Talha Ahmed",
    role: "Founder & CEO",
    description: "Full-stack developer passionate about AI and career development.",
  },
  {
    name: "Sarah Khan",
    role: "Head of AI",
    description: "AI researcher specializing in NLP and machine learning applications.",
  },
  {
    name: "Rafiq Hassan",
    role: "Lead Designer",
    description: "UX designer creating intuitive and beautiful user experiences.",
  },
  {
    name: "Nadia Islam",
    role: "Product Manager",
    description: "Strategic thinker driving product innovation and user satisfaction.",
  },
];

const values = [
  {
    icon: Heart,
    title: "User First",
    description: "Every feature we build starts with a simple question: how does this help our users succeed?",
  },
  {
    icon: Shield,
    title: "Trust & Privacy",
    description: "We protect user data with industry-leading security and never sell personal information.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We leverage cutting-edge AI to solve real career challenges in ways never possible before.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Career growth should be available to everyone, regardless of background or location.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-PrimaryColor/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-SrcPrimaryColor/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-PrimaryColorLight to-SrcPrimaryColorLight dark:from-PrimaryColorDark/20 dark:to-SrcPrimaryColorDark/20 px-4 py-2 mb-6">
              <Sparkles size={16} className="text-PrimaryColor" />
              <span className="text-sm font-medium font-SecondaryFont text-PrimaryColor dark:text-SrcPrimaryColor">
                About HireMind
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight mb-6">
              Redefining Career Growth with{" "}
              <span className="bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>
            <p className="text-lg font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
              HireMind is an AI-powered job board and career coaching platform that connects
              job seekers with opportunities while providing intelligent tools to accelerate
              career growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor to-PrimaryColor/80">
                  <Target size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                  Our Mission
                </h2>
              </div>
              <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed mb-6">
                To democratize career growth by making AI-powered tools accessible to every job
                seeker and recruiter. We believe that talent deserves to be discovered, and
                every career journey deserves smart guidance.
              </p>
              <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                From AI-generated cover letters to smart job recommendations, we are building
                the future of how people find and secure their dream jobs.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-SrcPrimaryColor to-SrcPrimaryColor/80">
                  <Eye size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold font-PrimaryFont text-TextPrimary dark:text-white">
                  Our Vision
                </h2>
              </div>
              <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed mb-6">
                To become the most intelligent career platform in the world, where AI understands
                your skills, anticipates your needs, and opens doors you never knew existed.
              </p>
              <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                We envision a world where career coaching is not a luxury but a standard, powered
                by AI that truly understands the modern job market.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-CardLight dark:bg-[#0B1120]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight mb-4">
              Our Core Values
            </h2>
            <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 text-center hover:shadow-lg hover:shadow-PrimaryColor/5 transition-all duration-300"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-PrimaryColor/10 to-SrcPrimaryColor/10 mb-4">
                  <value.icon size={22} className="text-PrimaryColor dark:text-SrcPrimaryColor" />
                </div>
                <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight mb-4">
              Meet Our Team
            </h2>
            <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto">
              The passionate people behind HireMind who are dedicated to transforming careers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-[#1e293b] rounded-2xl border border-Border dark:border-secondary p-6 text-center hover:shadow-lg hover:shadow-SrcPrimaryColor/5 transition-all duration-300"
              >
                <div className="size-20 rounded-full bg-gradient-to-br from-PrimaryColor/20 to-SrcPrimaryColor/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-PrimaryFont text-PrimaryColor dark:text-SrcPrimaryColor">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-PrimaryFont text-TextPrimary dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium font-SecondaryFont text-SrcPrimaryColor mb-2">
                  {member.role}
                </p>
                <p className="text-sm font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-PrimaryColor to-SrcPrimaryColor">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-white tracking-tight mb-4">
              Platform Impact
            </h2>
            <p className="font-SecondaryFont text-white/80 max-w-2xl mx-auto">
              Numbers that reflect our commitment to helping people find their dream careers.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Jobs", value: "2,500+", icon: BarChart3 },
              { label: "Registered Users", value: "15,000+", icon: Users },
              { label: "Companies", value: "500+", icon: Globe },
              { label: "Applications Sent", value: "50,000+", icon: Heart },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-white/20 mb-3">
                  <stat.icon size={22} className="text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-SecondaryFont text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="font-SecondaryFont text-TextSecondary dark:text-text-secondary max-w-2xl mx-auto mb-8">
            Join thousands of professionals who are already using HireMind to advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-PrimaryColor to-SrcPrimaryColor px-8 py-3.5 text-sm font-semibold font-SecondaryFont text-white hover:opacity-90 transition-opacity"
            >
              Browse Jobs
            </a>
            <a
              href="/regester"
              className="inline-flex items-center gap-2 rounded-xl border border-Border dark:border-secondary px-8 py-3.5 text-sm font-semibold font-SecondaryFont text-TextPrimary dark:text-white hover:bg-BorderLight dark:hover:bg-secondary/15 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
