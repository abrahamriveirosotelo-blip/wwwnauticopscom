import { useState } from "react";
import { Users, ChevronDown, ChevronUp, Anchor, Code2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const memberIcons = [Anchor, Code2];

const AboutSection = () => {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggle = (index: number) => setExpandedIndex((prev) => (prev === index ? null : index));

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
            {t.about.badge}
          </span>
          <h2 className="heading-lg mb-6 text-balance text-foreground">{t.about.title}</h2>
          <p className="body-lg text-balance text-muted-foreground">{t.about.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {t.about.members.map((member, index) => {
            const isExpanded = expandedIndex === index;
            const Icon = memberIcons[index];

            return (
              <div key={member.name} className="card-maritime p-5 sm:p-8">
                {/* Header */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="icon-container h-14 w-14 flex-shrink-0">
                    <Icon className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="heading-sm leading-tight text-foreground">{member.name}</h3>
                    <p className="text-sm font-medium text-secondary">{member.role}</p>
                  </div>
                </div>

                <p className="mb-4 text-xs tracking-wide text-muted-foreground">{member.tags}</p>

                {/* Short bio */}
                <p className="body-md mb-4 text-muted-foreground">{member.shortBio}</p>

                {/* Expand / collapse */}
                <button
                  onClick={() => toggle(index)}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
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
                  <div className="animate-fade-in mt-6 border-t border-border pt-6">
                    {member.fullBio.map((paragraph, i) => (
                      <p key={i} className="body-md mb-4 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}

                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                      {t.about.roleAtNauticOps}
                    </h4>
                    <ul className="space-y-2">
                      {member.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
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
