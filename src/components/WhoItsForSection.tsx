import { 
  Building2, 
  Ship, 
  Anchor as AnchorIcon, 
  Container, 
  Navigation, 
  Wrench, 
  Settings, 
  Briefcase 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [
  Building2, Ship, Container, AnchorIcon,
  Navigation, Wrench, Settings, Briefcase,
];

const WhoItsForSection = () => {
  const { t } = useLanguage();

  return (
    <section id="who-its-for" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
            {t.whoItsFor.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.whoItsFor.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.whoItsFor.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {t.whoItsFor.audiences.map((audience, index) => {
            const Icon = iconMap[index];
            return (
              <div key={audience.title} className="card-maritime p-6 text-center">
                <div className="icon-container w-14 h-14 mx-auto mb-5">
                  <Icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {audience.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {audience.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
