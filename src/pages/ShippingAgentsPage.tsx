import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  MessageSquareOff,
  FileX,
  CheckCircle2,
  Eye,
  Bell,
  Layers,
  MapPin,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { shippingAgentsEn, shippingAgentsEs } from "@/lib/translations/shippingAgents";
import Navbar from "@/components/Navbar";
import ShippingAgentsCTAForm from "@/components/ShippingAgentsCTAForm";
import { trackCtaClick } from "@/lib/analytics";
import Footer from "@/components/Footer";

// ─── SEO ──────────────────────────────────────────────────────────────────────

function usePageSEO(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";

    document.title = title;
    metaDesc?.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}

// ─── SCROLL HELPER ────────────────────────────────────────────────────────────

const scrollToForm = () => {
  document.getElementById("pilot-form")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => document.getElementById("sa-name")?.focus(), 800);
};

// ─── SECTION: Hero ────────────────────────────────────────────────────────────

const Hero = ({ t }: { t: typeof shippingAgentsEn }) => {
  const lines = t.hero.h1.split("\n");
  const phraseLines = t.hero.impactPhrase.split("\n");

  return (
    <section className="hero-gradient relative overflow-hidden pt-[6.5rem]">
      <div className="hero-pattern absolute inset-0" />
      <div className="hero-tech-overlay absolute inset-0" />
      <div className="hero-vignette absolute inset-0" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20">
            {t.hero.badge}
          </span>

          <h1 className="heading-xl text-primary-foreground mb-6 text-balance">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br className="hidden sm:block" />}
              </span>
            ))}
          </h1>

          <p className="body-lg text-primary-foreground/80 mb-4 max-w-2xl mx-auto text-balance">
            {t.hero.subtitle}
          </p>

          <p className="text-sm font-medium text-primary-foreground/50 mb-10 tracking-wide">
            {t.hero.supportingLine}
          </p>

          {/* Impact phrase */}
          <div className="inline-block mb-10 px-6 py-4 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5">
            <p className="text-base sm:text-lg font-semibold text-primary-foreground/90 text-balance">
              {phraseLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < phraseLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="hero"
              size="xl"
              className="w-full sm:w-auto shadow-[0_0_30px_-5px_hsl(200_70%_45%/0.4)]"
              onClick={() => {
                trackCtaClick("hero");
                scrollToForm();
              }}
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="xl" className="w-full">
                {t.hero.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="wave-bottom">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.55,118.68,127.42,108.35,191.24,91.23,248.65,75.84,274.73,64.9,321.39,56.44Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

// ─── SECTION: Pain ────────────────────────────────────────────────────────────

const painIcons = [MessageSquareOff, Clock, FileX, AlertTriangle];

const PainSection = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
          {t.pain.badge}
        </span>
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          {t.pain.title}
        </h2>
        <p className="body-lg text-muted-foreground text-balance">
          {t.pain.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {t.pain.items.map(({ title, body }, i) => {
          const Icon = painIcons[i];
          return (
            <div key={title} className="card-maritime p-5 sm:p-8">
              <div className="icon-container w-14 h-14 mb-6">
                <Icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="heading-sm text-foreground mb-3">{title}</h3>
              <p className="body-md text-muted-foreground">{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── SECTION: Solution ────────────────────────────────────────────────────────

const solutionIcons = [Eye, Bell, CheckCircle2, Layers];

const SolutionSection = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
          {t.solution.badge}
        </span>
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          {t.solution.title}
        </h2>
        <p className="body-lg text-muted-foreground text-balance">
          {t.solution.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {t.solution.features.map(({ title, body }, i) => {
          const Icon = solutionIcons[i];
          return (
            <div key={title} className="flex gap-5">
              <div className="icon-container w-14 h-14 flex-shrink-0">
                <Icon className="h-7 w-7 text-secondary" />
              </div>
              <div>
                <h3 className="heading-sm text-foreground mb-2">{title}</h3>
                <p className="body-md text-muted-foreground">{body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── SECTION: How it works ────────────────────────────────────────────────────

const HowItWorks = ({ t }: { t: typeof shippingAgentsEn }) => {
  const titleLines = t.howItWorks.title.split("\n");
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            {t.howItWorks.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="hidden lg:block absolute left-[2.75rem] top-16 bottom-16 w-px bg-border" />
            <div className="space-y-10">
              {t.howItWorks.steps.map(({ number, title, body }) => (
                <div key={number} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-[5.5rem] h-[5.5rem] flex items-center justify-center rounded-2xl bg-primary text-primary-foreground relative z-10">
                    <span className="text-xl font-bold tracking-tight">{number}</span>
                  </div>
                  <div className="pt-3 flex-1">
                    <h3 className="heading-sm text-foreground mb-2">{title}</h3>
                    <p className="body-md text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION: No replacement ──────────────────────────────────────────────────

const NoReplacement = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
              {t.noReplacement.badge}
            </span>
            <h2 className="heading-lg text-foreground mb-6 text-balance">
              {t.noReplacement.title}
            </h2>
            <p className="body-lg text-muted-foreground mb-4">{t.noReplacement.text1}</p>
            <p className="body-md text-muted-foreground">{t.noReplacement.text2}</p>
          </div>

          <div className="card-maritime p-6 sm:p-8">
            <h3 className="heading-sm text-foreground mb-6">{t.noReplacement.cardTitle}</h3>
            <ul className="space-y-5">
              {t.noReplacement.items.map(({ label, note }) => (
                <li key={label}>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{label}</p>
                  <p className="text-sm text-muted-foreground">{note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION: Credibility ─────────────────────────────────────────────────────

const CredibilitySection = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
            {t.credibility.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.credibility.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            {t.credibility.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ecosystem actors */}
          <div className="card-maritime p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container w-10 h-10">
                <Award className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.credibility.actorsTitle}</h3>
            </div>
            <ul className="space-y-3">
              {t.credibility.actors.map((actor) => (
                <li key={actor} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                  <span className="text-foreground font-medium text-sm">{actor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporters */}
          <div className="card-maritime p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container w-10 h-10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.credibility.supportedTitle}</h3>
            </div>
            <ul className="space-y-4">
              {t.credibility.supporters.map((s) => (
                <li key={s} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-secondary/30 pl-4">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION: Pilot ports ─────────────────────────────────────────────────────

const PilotPorts = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
          {t.pilotPorts.badge}
        </span>
        <h2 className="heading-md text-foreground mb-4 text-balance">
          {t.pilotPorts.title}
        </h2>
        <p className="body-md text-muted-foreground text-balance">
          {t.pilotPorts.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
        {t.pilotPorts.ports.map(({ name, country }) => (
          <div
            key={name}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-card shadow-sm"
          >
            <MapPin className="h-4 w-4 text-secondary flex-shrink-0" />
            <span className="font-semibold text-foreground text-sm">{name}</span>
            <span className="text-muted-foreground text-xs">· {country}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── SECTION: Form ────────────────────────────────────────────────────────────

const FormSection = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section id="pilot-form" className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="lg:pt-4">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
              {t.form.badge}
            </span>
            <h2 className="heading-lg text-foreground mb-6 text-balance">
              {t.bottomCta.title}
            </h2>
            <p className="body-lg text-muted-foreground mb-8 text-balance">
              {t.bottomCta.subtitle}
            </p>
            <ul className="space-y-3">
              {[
                t.credibility.actors[0],
                t.credibility.actors[1],
                t.credibility.actors[2],
                t.credibility.actors[3],
              ].map((actor) => (
                <li key={actor} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-foreground font-medium">{actor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-5 sm:p-8 shadow-xl">
            <h3 className="heading-sm text-foreground mb-6 text-center">
              {t.form.title}
            </h3>
            <ShippingAgentsCTAForm t={t.form} />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── SECTION: Bottom CTA bridge ───────────────────────────────────────────────

const BottomCTA = ({ t }: { t: typeof shippingAgentsEn }) => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          {t.bottomCta.title}
        </h2>
        <p className="body-lg text-muted-foreground mb-10 text-balance">
          {t.bottomCta.subtitle}
        </p>
        <Button
          variant="default"
          size="xl"
          onClick={() => {
            trackCtaClick("bottom_cta");
            scrollToForm();
          }}
        >
          {t.bottomCta.button}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const ShippingAgentsPage = () => {
  const { language } = useLanguage();
  const t = language === "es" ? shippingAgentsEs : shippingAgentsEn;

  usePageSEO(t.meta.title, t.meta.description);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero t={t} />
        <PainSection t={t} />
        <SolutionSection t={t} />
        <HowItWorks t={t} />
        <NoReplacement t={t} />
        <CredibilitySection t={t} />
        <PilotPorts t={t} />
        <BottomCTA t={t} />
        <FormSection t={t} />
      </main>
      <Footer />
    </div>
  );
};

export default ShippingAgentsPage;
