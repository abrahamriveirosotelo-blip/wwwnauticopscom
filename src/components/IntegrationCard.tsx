import { Plug } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const IntegrationCard = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto card-maritime p-8 md:p-12 text-center">
          <div className="icon-container w-14 h-14 mx-auto mb-6">
            <Plug className="h-7 w-7 text-secondary" />
          </div>
          <h3 className="heading-md text-foreground mb-4 text-balance">
            {t.integrationCard.title}
          </h3>
          <p className="body-md text-muted-foreground max-w-xl mx-auto text-balance">
            {t.integrationCard.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntegrationCard;
