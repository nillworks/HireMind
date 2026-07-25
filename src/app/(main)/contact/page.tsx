import ContactPage from "@/components/ContactPage/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | HireMind",
  description:
    "Get in touch with the HireMind team. We're here to help with questions, partnerships, and support.",
};

export default function Contact() {
  return <ContactPage />;
}
