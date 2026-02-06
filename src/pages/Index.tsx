import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContextSection from "@/components/ContextSection";
import SolutionSection from "@/components/SolutionSection";
import IntegrationCard from "@/components/IntegrationCard";
import HowItFitsSection from "@/components/HowItWorksSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import UseCasesSection from "@/components/UseCasesSection";
import TrustSection from "@/components/TrustSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ContextSection />
        <SolutionSection />
        <IntegrationCard />
        <HowItFitsSection />
        <WhoItsForSection />
        <UseCasesSection />
        <TrustSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
