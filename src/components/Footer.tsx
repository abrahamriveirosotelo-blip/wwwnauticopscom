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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand — uses same logo as Navbar */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={nauticopsLogo} alt="NauticOps" className="h-14 w-auto" />
            </div>
            <p className="text-primary-foreground/60 mb-6 max-w-xs text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="mt-6">
              <h4 className="font-semibold mb-4 text-sm">{t.footer.directContact}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.linkedin.com/in/abraham-riveiro-sotelo-nauticops"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick('linkedin')}
                    className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground hover:underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn · Abraham Riveiro
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@nauticops.com"
                    onClick={() => trackContactClick('email')}
                    className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground hover:underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Mail className="h-4 w-4" />
                    info@nauticops.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+34673108104"
                    onClick={() => trackContactClick('phone')}
                    className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-primary-foreground hover:underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Phone className="h-4 w-4" />
                    +34 673 108 104
                  </a>
                </li>
              </ul>
              <p className="text-xs text-primary-foreground/40 mt-4 max-w-xs leading-relaxed">
                {t.footer.directContactDescription}
              </p>
              <p className="text-xs text-primary-foreground/30 mt-2 max-w-xs leading-relaxed italic">
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
              <h4 className="font-semibold mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
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
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} NauticOps. {t.footer.copyright}
          </p>
          <p className="text-xs text-primary-foreground/30 italic tracking-wide">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
