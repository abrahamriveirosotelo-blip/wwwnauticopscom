import { Clock, Truck, FileText, BarChart3 } from "lucide-react";

const useCases = [
  {
    icon: Clock,
    category: "Arrival Coordination",
    title: "Real-Time ETA Updates",
    description:
      "A vessel's ETA changes 6 hours before arrival. Instead of dozens of calls and emails, NauticOps instantly notifies pilots, tugs, mooring, and the terminal—everyone adjusts their schedule from a single source.",
    stats: [
      { label: "Communication Time", value: "-85%" },
      { label: "Coordination Errors", value: "-60%" },
    ],
  },
  {
    icon: Truck,
    category: "Service Scheduling",
    title: "Synchronized Port Services",
    description:
      "When a vessel confirms its berth window, all service providers—fuel, provisions, waste removal—receive their assigned windows automatically. Status updates flow back to the agent and port authority in real time.",
    stats: [
      { label: "Service Delays", value: "-40%" },
      { label: "Confirmation Speed", value: "3x" },
    ],
  },
  {
    icon: FileText,
    category: "Documentation",
    title: "Digital Pre-Arrival Workflow",
    description:
      "All pre-arrival documents and clearances tracked in one place. The port authority sees submission status, agents track approvals, and missing items trigger automatic reminders before they cause delays.",
    stats: [
      { label: "Document Processing", value: "-50%" },
      { label: "Compliance Issues", value: "-70%" },
    ],
  },
  {
    icon: BarChart3,
    category: "Operations Analytics",
    title: "Port Performance Visibility",
    description:
      "Track turnaround times, berth utilization, and service efficiency across all port calls. Identify bottlenecks, measure KPIs, and generate reports for stakeholders and regulators.",
    stats: [
      { label: "Report Generation", value: "Instant" },
      { label: "Data Accuracy", value: "99%" },
    ],
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            Use Cases
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            Real Scenarios, Real Value
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            See how NauticOps addresses everyday coordination challenges 
            that cost ports and their stakeholders time and money.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div key={useCase.title} className="card-maritime p-8">
              <div className="flex items-start gap-5">
                <div className="icon-container w-14 h-14 flex-shrink-0">
                  <useCase.icon className="h-7 w-7 text-ocean" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-ocean mb-1 block">
                    {useCase.category}
                  </span>
                  <h3 className="heading-sm text-foreground mb-3">
                    {useCase.title}
                  </h3>
                </div>
              </div>
              
              <p className="body-md text-muted-foreground mt-4 mb-6">
                {useCase.description}
              </p>
              
              <div className="flex gap-6 pt-4 border-t border-border">
                {useCase.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-ocean">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
