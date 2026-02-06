import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-port.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern port operations"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 hero-pattern" />
      </div>
      
      {/* Wave Bottom */}
      <div className="wave-bottom">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.55,118.68,127.42,108.35,191.24,91.23,248.65,75.84,274.73,64.9,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up opacity-0">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20">
              Real-Time Port Call Coordination
            </span>
          </div>
          
          <h1 className="heading-xl text-primary-foreground mb-6 animate-fade-in-up opacity-0 stagger-1 text-balance">
            Unified Visibility for Every Port Call
          </h1>
          
          <p className="body-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in-up opacity-0 stagger-2 text-balance">
            NauticOps connects port authorities, agents, terminals, and service providers 
            on a single coordination platform—without replacing your existing systems.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 stagger-3">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Request a Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              <Play className="h-5 w-5" />
              View Platform
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 animate-fade-in-up opacity-0 stagger-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">50+</div>
              <div className="text-sm text-primary-foreground/60">Port Calls Managed</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">24/7</div>
              <div className="text-sm text-primary-foreground/60">Real-Time Updates</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">100%</div>
              <div className="text-sm text-primary-foreground/60">System Agnostic</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
