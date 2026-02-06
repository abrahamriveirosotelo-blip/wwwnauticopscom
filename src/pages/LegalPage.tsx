import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import nauticopsLogo from "@/assets/nauticops-logo.png";

type LegalSection = "privacy" | "terms" | "security";

const LegalPage = () => {
  const { section } = useParams<{ section: string }>();
  const { t } = useLanguage();

  const key = (section || "privacy") as LegalSection;
  const data = t.legal[key];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/">
            <img src={nauticopsLogo} alt="NauticOps" className="h-12 w-auto" />
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <Link
          to="/"
          className="inline-block mb-8 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
        >
          {t.legal.backToHome}
        </Link>

        <h1 className="heading-lg text-foreground mb-8">{data.title}</h1>

        <div className="space-y-4">
          {data.content.map((paragraph: string, i: number) => (
            <p key={i} className="body-md text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}

          {"contact" in data && (
            <p className="body-md">
              <a
                href={`mailto:${data.contact}`}
                className="text-secondary hover:text-secondary/80 underline underline-offset-4 transition-colors"
              >
                {data.contact}
              </a>
            </p>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NauticOps. {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;
