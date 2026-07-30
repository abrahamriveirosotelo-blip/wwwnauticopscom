import {
  Building2,
  Ship,
  Anchor as AnchorIcon,
  Container,
  Navigation,
  Wrench,
  Settings,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { shippingAgentsEn, shippingAgentsEs } from "@/lib/translations/shippingAgents";

const iconMap = [Building2, Ship, Container, AnchorIcon, Navigation, Wrench, Settings, Briefcase];

const WhoItsForSection = () => {
  const { t, language } = useLanguage();
  const saT = language === "es" ? shippingAgentsEs : shippingAgentsEn;

  return (
    <section id="who-its-for" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            {t.whoItsFor.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.whoItsFor.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.whoItsFor.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.whoItsFor.audiences.map((audience, index) => {
            const Icon = iconMap[index];
            return (
              <div key={audience.title} className="card-maritime p-6 text-center">
                <div className="icon-container mx-auto mb-5 h-14 w-14">
                  <Icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{audience.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
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

export default WhoItsForSection;
