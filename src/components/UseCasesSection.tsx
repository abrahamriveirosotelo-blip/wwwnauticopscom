import { History, Ship, FileCheck, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { shippingAgentsEn, shippingAgentsEs } from "@/lib/translations/shippingAgents";

const iconMap = [History, Ship, FileCheck, BarChart3];

const UseCasesSection = () => {
  const { t, language } = useLanguage();
  const saT = language === "es" ? shippingAgentsEs : shippingAgentsEn;

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
              <div key={useCase.title} className="card-maritime p-5 sm:p-8">
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
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 border-t border-border">
                  {useCase.stats.map((stat) => (
                    <div key={stat.label} className="min-w-0">
                      <div className="text-lg sm:text-2xl font-bold text-secondary break-words">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to shipping agents landing */}
        <div className="text-center mt-12">
          <Link
            to="/for-shipping-agents"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
          >
            {saT.nav.link}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
