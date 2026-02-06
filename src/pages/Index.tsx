import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ContextSection from "@/components/ContextSection";
import SolutionSection from "@/components/SolutionSection";
import HowItFitsSection from "@/components/HowItWorksSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import UseCasesSection from "@/components/UseCasesSection";
import TrustSection from "@/components/TrustSection";
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
        <HowItFitsSection />
        <WhoItsForSection />
        <UseCasesSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
