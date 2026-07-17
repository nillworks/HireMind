import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavigationMenu from "@/components/shared/NavigationMenu";
import Footer from "@/components/shared/Footer";

const primaryFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-PrimaryFont",
});

const secondaryFont = Inter({
  subsets: ["latin"],
  variable: "--font-SecondaryFont",
});
export const metadata: Metadata = {
  title: "TalentAI - AI-Powered Job Board & Career Coaching",
  description: "Discover opportunities, get AI-generated cover letters, and advance your career with smart recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${primaryFont.variable} ${secondaryFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <NavigationMenu/>
        <main className="flex-1">
          {children}
        </main>
        <Footer/>


      </body>
    </html>
  );
}
