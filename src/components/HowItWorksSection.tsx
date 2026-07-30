import { Link2, Eye, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Link2, Eye, Bell];

const HowItFitsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="how-it-fits" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {t.howItFits.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.howItFits.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.howItFits.subtitle}</p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-[16.67%] right-[16.67%] top-24 hidden h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 lg:block" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {t.howItFits.steps.map((step, index) => {
              const Icon = iconMap[index];
              return (
                <div key={step.title} className="relative text-center">
                  <div className="relative mb-6 inline-flex items-center justify-center">
                    <div className="absolute inset-0 scale-150 rounded-full bg-secondary/10" />
                    <div className="icon-container relative h-20 w-20 !rounded-full border-4 border-background">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="heading-sm mb-4 text-foreground">{step.title}</h3>
                  <p className="body-md mx-auto max-w-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItFitsSection;
