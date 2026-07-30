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
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {t.useCases.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.useCases.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.useCases.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {t.useCases.cases.map((useCase, index) => {
            const Icon = iconMap[index];
            return (
              <div key={useCase.title} className="card-maritime p-5 sm:p-8">
                <div className="flex items-center gap-5">
                  <div className="icon-container h-14 w-14 flex-shrink-0">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <span className="mb-1 block text-sm font-medium text-secondary">
                      {useCase.category}
                    </span>
                    <h3 className="heading-sm text-foreground">{useCase.title}</h3>
                  </div>
                </div>

                <p className="body-md mb-6 mt-4 text-muted-foreground">{useCase.description}</p>

                <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:gap-6">
                  {useCase.stats.map((stat) => (
                    <div key={stat.label} className="min-w-0">
                      <div className="break-words text-lg font-bold text-secondary sm:text-2xl">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to shipping agents landing */}
        <div className="mt-12 text-center">
          <Link
            to="/for-shipping-agents"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-secondary/80"
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
