import { Shield, Globe, Layers, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const iconMap = [Shield, Globe, Layers, Award];

const TrustSection = () => {
  const { t } = useLanguage();

  return (
    <section id="trust" className="section-padding bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            {t.trust.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.trust.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.trust.subtitle}</p>
        </div>

        <div className="mx-auto mb-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.trust.points.map((point, index) => {
            const Icon = iconMap[index];
            return (
              <div key={point.title} className="card-maritime p-6 text-center">
                <div className="icon-container mx-auto mb-4 h-12 w-12">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mb-16 max-w-4xl">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t.trust.ecosystemTitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {t.trust.ecosystemItems.map((name) => (
              <div
                key={name}
                className="rounded-md border border-border bg-card px-6 py-3 text-sm font-medium text-muted-foreground"
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* Institutional backing */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            {t.trust.backedBy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {t.trust.backedByItems.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:border-secondary/40 hover:text-secondary hover:shadow-sm"
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
