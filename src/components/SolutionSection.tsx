import { Check, Zap, Shield, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Zap, RefreshCw, Shield];

const SolutionSection = () => {
  const { t } = useLanguage();

  return (
    <section id="solution" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            {t.solution.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.solution.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.solution.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            {t.solution.features.map((feature, index) => {
              const Icon = iconMap[index];
              return (
                <div key={feature.title} className="flex gap-5">
                  <div className="icon-container h-14 w-14 flex-shrink-0">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="heading-sm mb-2 text-foreground">{feature.title}</h3>
                    <p className="body-md text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-maritime p-8 lg:p-10">
            <h3 className="heading-md mb-6 text-foreground">{t.solution.cardTitle}</h3>
            <p className="body-md mb-8 text-muted-foreground">{t.solution.cardDescription}</p>
            <ul className="space-y-4">
              {t.solution.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="font-medium text-foreground">{benefit}</span>
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
