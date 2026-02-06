import { AlertTriangle, Clock, Users, Layers } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [AlertTriangle, Clock, Users, Layers];

const ProblemSection = () => {
  const { t } = useLanguage();

  return (
    <section id="problem" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            {t.problem.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.problem.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.problem.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {t.problem.items.map((problem, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={problem.title}
                className="card-maritime p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="icon-container w-14 h-14 mb-6">
                  <Icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="heading-sm text-foreground mb-3">{problem.title}</h3>
                <p className="body-md text-muted-foreground">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
