import { History, Ship, FileCheck, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [History, Ship, FileCheck, BarChart3];

const UseCasesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="use-cases" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            {t.useCases.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.useCases.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.useCases.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {t.useCases.cases.map((useCase, index) => {
            const Icon = iconMap[index];
            return (
              <div key={useCase.title} className="card-maritime p-8">
                <div className="flex items-center gap-5">
                  <div className="icon-container w-14 h-14 flex-shrink-0">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-secondary mb-1 block">
                      {useCase.category}
                    </span>
                    <h3 className="heading-sm text-foreground">
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
                      <div className="text-2xl font-bold text-secondary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
