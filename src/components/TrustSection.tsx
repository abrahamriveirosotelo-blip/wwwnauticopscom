import { Shield, Globe, Layers, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Shield, Globe, Layers, Award];

const TrustSection = () => {
  const { t } = useLanguage();

  return (
    <section id="trust" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
            {t.trust.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.trust.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.trust.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {t.trust.points.map((point, index) => {
            const Icon = iconMap[index];
            return (
              <div key={point.title} className="card-maritime p-6 text-center">
                <div className="icon-container w-12 h-12 mx-auto mb-4">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
            {t.trust.ecosystemTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {t.trust.ecosystemItems.map((name) => (
              <div
                key={name}
                className="px-6 py-3 bg-card rounded-md border border-border text-sm font-medium text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Institutional backing */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t.trust.backedBy}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {t.trust.backedByItems.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-card rounded-md border border-border text-sm font-semibold text-foreground hover:border-secondary/50 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
