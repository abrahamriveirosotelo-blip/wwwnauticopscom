import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === "en"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("es")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          language === "es"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
