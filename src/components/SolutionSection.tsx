import { Check, Zap, Shield, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Non-Invasive Integration",
    description:
      "Connects to your existing PCS, ERP, and TOS systems. No need to replace what already works.",
  },
  {
    icon: RefreshCw,
    title: "Real-Time Sync",
    description:
      "All stakeholders see the same live data—ETAs, berth assignments, service readiness, and more.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Each party sees only what's relevant to them, with appropriate permissions and data privacy.",
  },
];

const benefits = [
  "Works alongside your current systems",
  "No disruption to established workflows",
  "Quick deployment in weeks, not months",
  "Immediate visibility improvements",
];

const SolutionSection = () => {
  return (
    <section id="solution" className="section-padding bg-ocean-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-ocean/10 text-ocean">
            The Solution
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            A Coordination Layer That Connects Everything
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            NauticOps doesn't replace your systems—it connects them. A lightweight 
            platform that creates shared visibility without changing how you work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="flex gap-5">
                <div className="icon-container w-14 h-14 flex-shrink-0">
                  <feature.icon className="h-7 w-7 text-ocean" />
                </div>
                <div>
                  <h3 className="heading-sm text-foreground mb-2">{feature.title}</h3>
                  <p className="body-md text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Benefits Card */}
          <div className="card-maritime p-8 lg:p-10">
            <h3 className="heading-md text-foreground mb-6">
              Complementary by Design
            </h3>
            <p className="body-md text-muted-foreground mb-8">
              Built to enhance your existing infrastructure, not compete with it. 
              NauticOps respects your investment in PCS, ERPs, and operational tools.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean/10">
                    <Check className="h-4 w-4 text-ocean" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
