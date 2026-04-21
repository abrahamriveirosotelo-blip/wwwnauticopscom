import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackCtaClick } from "@/lib/analytics";

const BottomCTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="heading-lg text-foreground mb-6 text-balance">
            {t.bottomCta.title}
          </h2>
          <p className="body-lg text-muted-foreground mb-10 text-balance">
            {t.bottomCta.text}
          </p>
          <Button
            variant="default"
            size="xl"
            onClick={() => {
              trackCtaClick('bottom_cta');
              document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => document.getElementById("name")?.focus(), 800);
            }}
          >
            {t.bottomCta.button}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BottomCTASection;
