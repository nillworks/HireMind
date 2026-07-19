import ContactHero from "@/components/ContactPage/ContactHero";
import ContactFormSection from "@/components/ContactPage/ContactFormSection";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-Background dark:bg-[#0f172a]">
      <ContactHero />
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ContactFormSection />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
