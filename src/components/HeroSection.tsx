import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-port.jpg";
import { trackCtaClick, trackPlatformClick } from "@/lib/analytics";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Modern port operations" className="h-full w-full object-cover" />
        <div className="hero-gradient absolute inset-0 opacity-[0.88]" />
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-tech-overlay absolute inset-0" />
        <div className="hero-vignette absolute inset-0" />
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
      <div className="container relative z-10 mx-auto px-5 pb-20 pt-28 sm:px-6 sm:pb-32 md:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mt-6 animate-fade-in-up opacity-0 md:mt-8">
            <span className="mb-6 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="heading-xl stagger-1 mb-6 animate-fade-in-up text-balance text-primary-foreground opacity-0">
            {t.hero.title}
          </h1>

          <p className="body-lg stagger-2 mx-auto mb-4 max-w-2xl animate-fade-in-up text-balance text-primary-foreground/85 opacity-0">
            {t.hero.subtitle}
          </p>

          <p className="stagger-2 mb-10 animate-fade-in-up text-sm font-medium tracking-wide text-primary-foreground/50 opacity-0">
            {t.hero.supportingLine}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="hero"
              size="xl"
              className="stagger-4 w-full animate-fade-in-up opacity-0 shadow-[0_0_30px_-5px_hsl(200_70%_45%/0.4)] sm:w-auto"
              onClick={() => {
                trackCtaClick("hero");
                document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => document.getElementById("name")?.focus(), 800);
              }}
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div className="stagger-5 flex w-full animate-fade-in-up flex-col items-center gap-1 opacity-0 sm:w-auto">
              <a
                href="https://www.nauticops.com/demo/marin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackPlatformClick("hero")}
                className="w-full"
              >
                <Button variant="heroOutline" size="xl" className="w-full">
                  <Play className="h-5 w-5" />
                  {t.hero.ctaSecondary}
                </Button>
              </a>
              <span className="text-xs text-primary-foreground/50">{t.hero.ctaSecondaryHint}</span>
            </div>
          </div>

          <div className="stagger-4 mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 opacity-0 sm:mt-16 sm:flex-row sm:gap-8">
            <div className="max-w-[250px] text-center sm:max-w-[200px]">
              <div className="text-xs font-medium text-primary-foreground/80 sm:text-sm">
                {t.hero.stats.portCalls}
              </div>
            </div>
            <div className="hidden h-8 w-px bg-primary-foreground/20 sm:block" />
            <div className="max-w-[250px] text-center sm:max-w-[200px]">
              <div className="text-xs font-medium text-primary-foreground/80 sm:text-sm">
                {t.hero.stats.realTime}
              </div>
            </div>
            <div className="hidden h-8 w-px bg-primary-foreground/20 sm:block" />
            <div className="max-w-[250px] text-center sm:max-w-[200px]">
              <div className="text-xs font-medium text-primary-foreground/80 sm:text-sm">
                {t.hero.stats.systemAgnostic}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
