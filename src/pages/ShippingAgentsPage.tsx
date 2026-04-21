import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Clock, MessageSquareOff, FileX, CheckCircle2, Eye, Bell, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const scrollToCTA = () => {
  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => document.getElementById("name")?.focus(), 800);
};

// ─── SEO ──────────────────────────────────────────────────────────────────────

function usePageSEO() {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = "NauticOps for Shipping Agents | Port Call Coordination Layer";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Stop coordinating port calls through WhatsApp chains. NauticOps gives shipping agents and all port actors a shared operational timeline — one update, everyone aligned."
      );
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
    };
  }, []);
}

// ─── SECTION 1 — Hero ─────────────────────────────────────────────────────────

const Hero = () => (
  <section className="hero-gradient relative overflow-hidden pt-[6.5rem]">
    <div className="hero-pattern absolute inset-0" />
    <div className="hero-tech-overlay absolute inset-0" />
    <div className="hero-vignette absolute inset-0" />

    <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20">
          For Shipping Agents &amp; Port Agents
        </span>

        <h1 className="heading-xl text-primary-foreground mb-6 text-balance">
          One update.<br className="hidden sm:block" /> Every party aligned.
        </h1>

        <p className="body-lg text-primary-foreground/80 mb-4 max-w-2xl mx-auto text-balance">
          NauticOps gives shipping agents a single shared operational view of every port call — visible in real time to the pilot, tug, mooring, terminal, and port authority.
        </p>

        <p className="text-sm font-medium text-primary-foreground/50 mb-10 tracking-wide">
          No integration project. No system replacement. Active from day one.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="hero"
            size="xl"
            className="w-full sm:w-auto shadow-[0_0_30px_-5px_hsl(200_70%_45%/0.4)]"
            onClick={scrollToCTA}
          >
            Request your pilot
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="heroOutline" size="xl" className="w-full">
              See the full platform
            </Button>
          </Link>
        </div>
      </div>
    </div>

    {/* Wave */}
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

// ─── SECTION 2 — Pain points ──────────────────────────────────────────────────

const painPoints = [
  {
    icon: MessageSquareOff,
    title: "You are the only one with the full picture",
    body: "The pilot, the tug, the terminal and the port authority each have their own partial view. You hold all the threads — and relay every change manually across six different conversations.",
  },
  {
    icon: Clock,
    title: "ETA changes travel slower than the vessel",
    body: "A delay of two hours means a chain of calls, messages and re-confirmations. By the time everyone is updated, the service schedule has shifted and no one agrees on the new timing.",
  },
  {
    icon: FileX,
    title: "No confirmation trail, no traceability",
    body: "Verbal confirmations and WhatsApp threads are not records. When something goes wrong, there is no log of who confirmed what, when, and under which conditions.",
  },
  {
    icon: AlertTriangle,
    title: "You become the coordination bottleneck",
    body: "The operation depends on your availability. If you are unreachable for thirty minutes, the berth assignment, the tug booking and the terminal slot are all on hold.",
  },
];

const PainSection = () => (
  <section className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
          The coordination gap
        </span>
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          The cost of coordinating a port call manually
        </h2>
        <p className="body-lg text-muted-foreground text-balance">
          Every port call involves five to eight actors with different systems, different schedules and no shared view. The shipping agent absorbs that complexity — every time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {painPoints.map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-maritime p-5 sm:p-8">
            <div className="icon-container w-14 h-14 mb-6">
              <Icon className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="heading-sm text-foreground mb-3">{title}</h3>
            <p className="body-md text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── SECTION 3 — Solution ─────────────────────────────────────────────────────

const solutionFeatures = [
  {
    icon: Eye,
    title: "One shared operational timeline",
    body: "Pilot, tug operator, mooring crew, terminal and port authority see the same port call timeline in real time — ETA, berth, service schedule, confirmations. No more fragmented pictures.",
  },
  {
    icon: Bell,
    title: "ETA changes propagate instantly",
    body: "Update the ETA once. Every actor with a service in that call sees the change immediately. Idle time caused by late notification drops to zero.",
  },
  {
    icon: CheckCircle2,
    title: "Confirmations per actor, on record",
    body: "Each party confirms their slot directly in the platform. You see the status of every service in real time. No follow-up calls to check if the tug is confirmed.",
  },
  {
    icon: Layers,
    title: "A layer on top, not a replacement",
    body: "NauticOps does not replace your port community system, your TOS or your existing tools. It sits on top as a lightweight coordination layer — active from day one, no migration required.",
  },
];

const SolutionSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
          The NauticOps layer
        </span>
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          A shared operational view for every port call
        </h2>
        <p className="body-lg text-muted-foreground text-balance">
          NauticOps connects all actors around a single source of truth for the port call. The shipping agent stops being the relay and starts being the supervisor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {solutionFeatures.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-5">
            <div className="icon-container w-14 h-14 flex-shrink-0">
              <Icon className="h-7 w-7 text-secondary" />
            </div>
            <div>
              <h3 className="heading-sm text-foreground mb-2">{title}</h3>
              <p className="body-md text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── SECTION 4 — How it works ─────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Vessel notification received",
    body: "You receive the arrival notice from the shipowner or operator. You create or confirm the port call in NauticOps — ETA, berth, services required.",
  },
  {
    number: "02",
    title: "All actors see the same timeline",
    body: "Pilot station, tug company, mooring crew and terminal access the shared timeline instantly. Each actor sees only what is relevant to their service — no information overload.",
  },
  {
    number: "03",
    title: "Changes propagate, confirmations accumulate",
    body: "When the ETA shifts, every actor is notified. Each one confirms their updated slot directly. You monitor overall progress from a single dashboard — no calls needed.",
  },
];

const HowItWorks = () => (
  <section className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
          Operational flow
        </span>
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          From notification to departure. One shared view.
        </h2>
        <p className="body-lg text-muted-foreground text-balance">
          NauticOps does not change how the port call works. It gives every actor visibility of the same call — in real time.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute left-[2.75rem] top-16 bottom-16 w-px bg-border" />

          <div className="space-y-10">
            {steps.map(({ number, title, body }) => (
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

// ─── SECTION 5 — No replacement reassurance ──────────────────────────────────

const noReplacementItems = [
  { label: "Port Community System (PCS)", note: "NauticOps does not replace it — it complements it with a real-time operational layer." },
  { label: "Terminal Operating System (TOS)", note: "Terminal operations continue in your TOS. NauticOps adds shared visibility of the port call timeline." },
  { label: "ERP or back-office tools", note: "Your financial and administrative workflows are untouched." },
  { label: "Messaging tools", note: "NauticOps is not a chat. It is a coordination layer with structured confirmations and a shared timeline." },
];

const NoReplacement = () => (
  <section className="section-padding bg-section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
              Zero friction adoption
            </span>
            <h2 className="heading-lg text-foreground mb-6 text-balance">
              NauticOps sits on top of what you already use
            </h2>
            <p className="body-lg text-muted-foreground mb-6">
              No integration project. No data migration. No training week. NauticOps is a lightweight coordination layer that connects the actors of the port call — without replacing any existing system.
            </p>
            <p className="body-md text-muted-foreground">
              In pilot mode, onboarding takes less than one working day. You set up the first port call and all actors are operational from that moment.
            </p>
          </div>

          <div className="card-maritime p-6 sm:p-8">
            <h3 className="heading-sm text-foreground mb-6">What NauticOps does not replace</h3>
            <ul className="space-y-5">
              {noReplacementItems.map(({ label, note }) => (
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

// ─── SECTION 6 — Bottom CTA bridge ───────────────────────────────────────────

const BottomCTA = () => (
  <section className="section-padding bg-background">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="heading-lg text-foreground mb-6 text-balance">
          Ready to run your first coordinated port call?
        </h2>
        <p className="body-lg text-muted-foreground mb-10 text-balance">
          Request a pilot for your agency. We set up the first port call together — at your port, with your services, with your actors.
        </p>
        <Button variant="default" size="xl" onClick={scrollToCTA}>
          Request pilot access
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const ShippingAgentsPage = () => {
  usePageSEO();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <SolutionSection />
        <HowItWorks />
        <NoReplacement />
        <BottomCTA />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default ShippingAgentsPage;
