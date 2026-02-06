import { useState } from "react";
import { Users, ChevronDown, ChevronUp, Anchor, Code2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const memberIcons = [Anchor, Code2];

const AboutSection = () => {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setExpandedIndex((prev) => (prev === index ? null : index));

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-secondary/10 text-secondary">
            {t.about.badge}
          </span>
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.about.title}
          </h2>
          <p className="body-lg text-muted-foreground text-balance">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {t.about.members.map((member, index) => {
            const isExpanded = expandedIndex === index;
            const Icon = memberIcons[index];

            return (
              <div key={member.name} className="card-maritime p-5 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="icon-container w-14 h-14 flex-shrink-0">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="heading-sm text-foreground leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-secondary">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4 tracking-wide">
                  {member.tags}
                </p>

                {/* Short bio */}
                <p className="body-md text-muted-foreground mb-4">
                  {member.shortBio}
                </p>

                {/* Expand / collapse */}
                <button
                  onClick={() => toggle(index)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-secondary/80 cursor-pointer transition-colors"
                >
                  {isExpanded ? t.about.readLess : t.about.readMore}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Extended content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                    {member.fullBio.map((paragraph, i) => (
                      <p
                        key={i}
                        className="body-md text-muted-foreground mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}

                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      {t.about.roleAtNauticOps}
                    </h4>
                    <ul className="space-y-2">
                      {member.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
