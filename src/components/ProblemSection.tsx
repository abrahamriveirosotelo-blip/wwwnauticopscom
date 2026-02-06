import { AlertTriangle, Clock, Users, Layers } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Fragmented Information",
    description:
      "Critical updates scattered across emails, calls, and disconnected systems. No single source of truth for port call status.",
  },
  {
    icon: Clock,
    title: "Last-Minute Surprises",
    description:
      "ETA changes, berth reassignments, and service delays communicated too late, causing costly operational disruptions.",
  },
  {
    icon: Users,
    title: "Coordination Gaps",
    description:
      "Pilots, tugs, mooring, and terminals working from different timelines. Misalignment creates inefficiency and delays.",
  },
  {
    icon: Layers,
    title: "System Silos",
    description:
      "Each stakeholder uses their own tools—PCS, ERPs, spreadsheets. No easy way to share real-time operational data.",
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            The Challenge
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            Port Call Coordination Is Still Broken
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            Despite decades of digital investment, port stakeholders still struggle 
            with fragmented communication and limited real-time visibility.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="card-maritime p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="icon-container w-14 h-14 mb-6">
                <problem.icon className="h-7 w-7 text-ocean" />
              </div>
              <h3 className="heading-sm text-foreground mb-3">{problem.title}</h3>
              <p className="body-md text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
