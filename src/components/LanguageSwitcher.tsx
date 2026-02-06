import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

const LanguageSwitcher = ({ variant = "light" }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const isDark = variant === "dark";

  return (
    <div className={`flex items-center gap-1 rounded-md p-0.5 ${
      isDark 
        ? "border border-primary-foreground/20 bg-primary-foreground/5"
        : "border border-border bg-muted/50"
    }`}>
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-2.5 py-1 text-sm font-medium rounded transition-all duration-200 ${
          language === "en"
            ? isDark
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-card text-foreground shadow-sm"
            : isDark
              ? "text-primary-foreground/50 hover:text-primary-foreground/70"
              : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("es")}
        className={`px-2.5 py-1 text-sm font-medium rounded transition-all duration-200 ${
          language === "es"
            ? isDark
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-card text-foreground shadow-sm"
            : isDark
              ? "text-primary-foreground/50 hover:text-primary-foreground/70"
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
