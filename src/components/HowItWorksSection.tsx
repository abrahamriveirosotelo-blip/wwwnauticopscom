import { Link2, Eye, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Connect Your Data",
    description:
      "Link NauticOps to your existing systems via APIs or manual input. We integrate with PCS, ERPs, TOS, and more—no migration required.",
  },
  {
    number: "02",
    icon: Eye,
    title: "See Everything in One Place",
    description:
      "All port call data—ETAs, berth schedules, service requests, vessel status—unified on a single, real-time dashboard for all stakeholders.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Coordinate in Real Time",
    description:
      "Instant notifications, status updates, and timeline changes visible to everyone who needs them. Reduce calls, emails, and delays.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            How It Works
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            Three Steps to Unified Port Operations
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            Get started quickly without disrupting your current workflows. 
            NauticOps is designed for fast deployment and immediate value.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-ocean/20 via-ocean to-ocean/20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Number Badge */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-ocean/10 rounded-full scale-150" />
                  <div className="relative icon-container w-20 h-20 !rounded-full border-4 border-background">
                    <step.icon className="h-8 w-8 text-ocean" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.number.slice(1)}
                  </span>
                </div>
                
                <h3 className="heading-sm text-foreground mb-4">{step.title}</h3>
                <p className="body-md text-muted-foreground max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
