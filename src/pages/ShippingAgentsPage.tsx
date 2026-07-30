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

      <div className="container relative z-10 mx-auto px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
            {t.hero.badge}
          </span>

          <h1 className="heading-xl mb-6 text-balance text-primary-foreground">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br className="hidden sm:block" />}
              </span>
            ))}
          </h1>

          <p className="body-lg mx-auto mb-4 max-w-2xl text-balance text-primary-foreground/80">
            {t.hero.subtitle}
          </p>

          <p className="mb-10 text-sm font-medium tracking-wide text-primary-foreground/50">
            {t.hero.supportingLine}
          </p>

          {/* Impact phrase */}
          <div className="mb-10 inline-block rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-6 py-4">
            <p className="text-balance text-base font-semibold text-primary-foreground/90 sm:text-lg">
              {phraseLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < phraseLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="hero"
              size="xl"
              className="w-full shadow-[0_0_30px_-5px_hsl(200_70%_45%/0.4)] sm:w-auto"
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
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          {t.pain.badge}
        </span>
        <h2 className="heading-lg mb-6 text-balance text-foreground">{t.pain.title}</h2>
        <p className="body-lg text-balance text-muted-foreground">{t.pain.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {t.pain.items.map(({ title, body }, i) => {
          const Icon = painIcons[i];
          return (
            <div key={title} className="card-maritime p-5 sm:p-8">
              <div className="icon-container mb-6 h-14 w-14">
                <Icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="heading-sm mb-3 text-foreground">{title}</h3>
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
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
          {t.solution.badge}
        </span>
        <h2 className="heading-lg mb-6 text-balance text-foreground">{t.solution.title}</h2>
        <p className="body-lg text-balance text-muted-foreground">{t.solution.subtitle}</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
        {t.solution.features.map(({ title, body }, i) => {
          const Icon = solutionIcons[i];
          return (
            <div key={title} className="flex gap-5">
              <div className="icon-container h-14 w-14 flex-shrink-0">
                <Icon className="h-7 w-7 text-secondary" />
              </div>
              <div>
                <h3 className="heading-sm mb-2 text-foreground">{title}</h3>
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
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {t.howItWorks.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="body-lg text-balance text-muted-foreground">{t.howItWorks.subtitle}</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute bottom-16 left-[2.75rem] top-16 hidden w-px bg-border lg:block" />
            <div className="space-y-10">
              {t.howItWorks.steps.map(({ number, title, body }) => (
                <div key={number} className="flex items-start gap-6">
                  <div className="relative z-10 flex h-[5.5rem] w-[5.5rem] flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <span className="text-xl font-bold tracking-tight">{number}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="heading-sm mb-2 text-foreground">{title}</h3>
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
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
              {t.noReplacement.badge}
            </span>
            <h2 className="heading-lg mb-6 text-balance text-foreground">
              {t.noReplacement.title}
            </h2>
            <p className="body-lg mb-4 text-muted-foreground">{t.noReplacement.text1}</p>
            <p className="body-md text-muted-foreground">{t.noReplacement.text2}</p>
          </div>

          <div className="card-maritime p-6 sm:p-8">
            <h3 className="heading-sm mb-6 text-foreground">{t.noReplacement.cardTitle}</h3>
            <ul className="space-y-5">
              {t.noReplacement.items.map(({ label, note }) => (
                <li key={label}>
                  <p className="mb-0.5 text-sm font-semibold text-foreground">{label}</p>
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            {t.credibility.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.credibility.title}</h2>
          <p className="body-lg mx-auto max-w-2xl text-balance text-muted-foreground">
            {t.credibility.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Ecosystem actors */}
          <div className="card-maritime p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="icon-container h-10 w-10">
                <Award className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.credibility.actorsTitle}</h3>
            </div>
            <ul className="space-y-3">
              {t.credibility.actors.map((actor) => (
                <li key={actor} className="flex items-center gap-3">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-secondary" />
                  <span className="text-sm font-medium text-foreground">{actor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporters */}
          <div className="card-maritime p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="icon-container h-10 w-10">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.credibility.supportedTitle}</h3>
            </div>
            <ul className="space-y-4">
              {t.credibility.supporters.map((s) => (
                <li
                  key={s}
                  className="border-l-2 border-secondary/30 pl-4 text-sm leading-relaxed text-muted-foreground"
                >
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
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
          {t.pilotPorts.badge}
        </span>
        <h2 className="heading-md mb-4 text-balance text-foreground">{t.pilotPorts.title}</h2>
        <p className="body-md text-balance text-muted-foreground">{t.pilotPorts.subtitle}</p>
      </div>

      <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4">
        {t.pilotPorts.ports.map(({ name, country }) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 shadow-sm"
          >
            <MapPin className="h-4 w-4 flex-shrink-0 text-secondary" />
            <span className="text-sm font-semibold text-foreground">{name}</span>
            <span className="text-xs text-muted-foreground">· {country}</span>
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
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="lg:pt-4">
            <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
              {t.form.badge}
            </span>
            <h2 className="heading-lg mb-6 text-balance text-foreground">{t.bottomCta.title}</h2>
            <p className="body-lg mb-8 text-balance text-muted-foreground">
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
                  <span className="font-medium text-foreground">{actor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-card p-5 shadow-xl sm:p-8">
            <h3 className="heading-sm mb-6 text-center text-foreground">{t.form.title}</h3>
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
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="heading-lg mb-6 text-balance text-foreground">{t.bottomCta.title}</h2>
        <p className="body-lg mb-10 text-balance text-muted-foreground">{t.bottomCta.subtitle}</p>
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
