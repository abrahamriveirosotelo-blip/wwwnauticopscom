import { Link } from "react-router-dom";
import { Linkedin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import nauticopsLogo from "@/assets/nauticops-logo.png";
import { trackContactClick } from "@/lib/analytics";
import { shippingAgentsEn, shippingAgentsEs } from "@/lib/translations/shippingAgents";

const Footer = () => {
  const { t, language } = useLanguage();
  const saT = language === "es" ? shippingAgentsEs : shippingAgentsEn;

  const footerLinks = {
    product: [
      { label: t.footer.links.features, href: "#solution" },
      { label: t.footer.links.useCases, href: "#use-cases" },
      { label: t.footer.links.integrations, href: "#trust" },
      { label: saT.nav.link, href: "/for-shipping-agents" },
    ],
    company: [
      { label: t.footer.links.aboutUs, href: "#about" },
      { label: t.footer.links.contact, href: "#cta" },
    ],
    legal: [
      { label: t.footer.links.privacyPolicy, href: "/legal/privacy" },
      { label: t.footer.links.termsOfService, href: "/legal/terms" },
      { label: t.footer.links.security, href: "/legal/security" },
    ],
  };

  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {/* Brand — uses same logo as Navbar */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={nauticopsLogo} alt="NauticOps" className="h-14 w-auto" />
            </div>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-primary-foreground/60">
              {t.footer.description}
            </p>
            <div className="mt-6">
              <h4 className="mb-4 text-sm font-semibold">{t.footer.directContact}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.linkedin.com/in/abraham-riveiro-sotelo-nauticops"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick("linkedin")}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary-foreground/60 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn · Abraham Riveiro
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@nauticops.com"
                    onClick={() => trackContactClick("email")}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary-foreground/60 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    info@nauticops.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+34673108104"
                    onClick={() => trackContactClick("phone")}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary-foreground/60 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    +34 673 108 104
                  </a>
                </li>
              </ul>
              <p className="mt-4 max-w-xs text-xs leading-relaxed text-primary-foreground/40">
                {t.footer.directContactDescription}
              </p>
              <p className="mt-2 max-w-xs text-xs italic leading-relaxed text-primary-foreground/30">
                {t.footer.directContactFallback}
              </p>
            </div>
          </div>

          {/* Links */}
          {[
            { title: t.footer.product, links: footerLinks.product },
            { title: t.footer.company, links: footerLinks.company },
            { title: t.footer.legal, links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} NauticOps. {t.footer.copyright}
          </p>
          <p className="text-xs italic tracking-wide text-primary-foreground/30">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
