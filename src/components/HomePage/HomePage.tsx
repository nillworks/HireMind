import HeroSection from "./HeroSection";
import FeaturedJobs from "./FeaturedJobs";
import AIToolsShowcase from "./AIToolsShowcase";
import JobCategories from "./JobCategories";
import PlatformStats from "./PlatformStats";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Newsletter from "./Newsletter";
import FAQ from "./FAQ";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedJobs />
      <AIToolsShowcase />
      <JobCategories />
      <PlatformStats />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <FAQ />
    </main>
  );
};

export default HomePage;
