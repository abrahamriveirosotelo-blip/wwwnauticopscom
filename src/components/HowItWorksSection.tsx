import { Link2, Eye, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Link2, Eye, Bell];

const HowItWorksSection = () => {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-muted text-muted-foreground">
            {t.howItWorks.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.howItWorks.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.howItWorks.subtitle}
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {t.howItWorks.steps.map((step, index) => {
              const Icon = iconMap[index];
              return (
                <div key={step.title} className="relative text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-secondary/10 rounded-full scale-150" />
                    <div className="relative icon-container w-20 h-20 !rounded-full border-4 border-background">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  
                  <h3 className="heading-sm text-foreground mb-4">{step.title}</h3>
                  <p className="body-md text-muted-foreground max-w-sm mx-auto">
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

export default HowItWorksSection;
