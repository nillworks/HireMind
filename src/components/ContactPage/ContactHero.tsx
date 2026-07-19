import { Sparkles, MessageSquare } from "lucide-react";

const ContactHero = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-SrcPrimaryColor/10 to-PrimaryColor/10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-SrcPrimaryColor/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-PrimaryColor/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-SrcPrimaryColorLight to-PrimaryColorLight dark:from-SrcPrimaryColorDark/20 dark:to-PrimaryColorDark/20 px-4 py-2 mb-6">
            <MessageSquare size={16} className="text-SrcPrimaryColor" />
            <span className="text-sm font-medium font-SecondaryFont text-SrcPrimaryColor dark:text-PrimaryColor">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-PrimaryFont text-TextPrimary dark:text-white tracking-tight mb-6">
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-SrcPrimaryColor to-PrimaryColor bg-clip-text text-transparent">
              Hear from You
            </span>
          </h1>
          <p className="text-lg font-SecondaryFont text-TextSecondary dark:text-text-secondary leading-relaxed">
            Have a question, suggestion, or want to partner with us? Reach out and our team
            will get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
