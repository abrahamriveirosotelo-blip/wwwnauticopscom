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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="hero-gradient">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/">
            <img src={nauticopsLogo} alt="NauticOps" className="h-12 w-auto" />
          </Link>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
        >
          {t.legal.backToHome}
        </Link>

        <h1 className="heading-lg mb-8 text-foreground">{data.title}</h1>

        <div className="space-y-4">
          {data.content.map((paragraph: string, i: number) => (
            <p key={i} className="body-md leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}

          {"contact" in data && (
            <p className="body-md">
              <a
                href={`mailto:${data.contact}`}
                className="text-secondary underline underline-offset-4 transition-colors hover:text-secondary/80"
              >
                {data.contact}
              </a>
            </p>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="mt-16 border-t border-border">
        <div className="container mx-auto px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NauticOps. {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;
