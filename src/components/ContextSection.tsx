import { Globe, Clock, Layers, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Globe, Clock, Layers, TrendingUp];

const ContextSection = () => {
  const { t } = useLanguage();

  return (
    <section id="context" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            {t.context.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.context.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.context.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {t.context.items.map((item, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={item.title}
                className="card-maritime p-5 sm:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="icon-container mb-6 h-14 w-14">
                  <Icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="heading-sm mb-3 text-foreground">{item.title}</h3>
                <p className="body-md text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContextSection;
