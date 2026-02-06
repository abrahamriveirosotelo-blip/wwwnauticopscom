import { 
  Building2, 
  Ship, 
  Anchor as AnchorIcon, 
  Container, 
  Navigation, 
  Wrench, 
  Settings, 
  Briefcase 
} from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Port Authorities",
    description:
      "Gain oversight of all port calls, coordinate vessel traffic, and ensure regulatory compliance with complete visibility.",
  },
  {
    icon: Ship,
    title: "Shipping Agents",
    description:
      "Manage multiple port calls across vessels, track service providers, and keep principals updated in real time.",
  },
  {
    icon: Container,
    title: "Terminal Operators",
    description:
      "Plan berth allocation, coordinate loading operations, and sync with all stakeholders on vessel timelines.",
  },
  {
    icon: AnchorIcon,
    title: "Pilots & Tugs",
    description:
      "See vessel arrivals early, confirm service windows, and coordinate with other maritime services seamlessly.",
  },
  {
    icon: Navigation,
    title: "Shipping Lines",
    description:
      "Track fleet port calls, monitor turnaround times, and get proactive updates on delays or changes.",
  },
  {
    icon: Wrench,
    title: "Service Providers",
    description:
      "Receive service requests in time, confirm availability, and update completion status for all parties.",
  },
  {
    icon: Settings,
    title: "System Integrators",
    description:
      "Leverage open APIs to connect NauticOps with existing port infrastructure and digital ecosystems.",
  },
  {
    icon: Briefcase,
    title: "Industry Partners",
    description:
      "Explore pilot opportunities, strategic partnerships, and early-stage investment in maritime coordination.",
  },
];

const WhoItsForSection = () => {
  return (
    <section id="who-its-for" className="section-padding bg-ocean-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-ocean/10 text-ocean">
            Who It's For
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            Built for Everyone in the Port Ecosystem
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            NauticOps serves the entire maritime community—from port authorities 
            and agents to terminal operators and service providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className="card-maritime p-6 text-center"
            >
              <div className="icon-container w-14 h-14 mx-auto mb-5">
                <audience.icon className="h-7 w-7 text-ocean" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {audience.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
