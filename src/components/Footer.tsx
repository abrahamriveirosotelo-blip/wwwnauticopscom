import { Linkedin, Twitter, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import nauticopsLogo from "@/assets/nauticops-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    product: [
      { label: t.footer.links.features, href: "#solution" },
      { label: t.footer.links.useCases, href: "#use-cases" },
      { label: t.footer.links.integrations, href: "#trust" },
      { label: t.footer.links.pricing, href: "#" },
    ],
    company: [
      { label: t.footer.links.aboutUs, href: "#" },
      { label: t.footer.links.careers, href: "#" },
      { label: t.footer.links.contact, href: "#cta" },
      { label: t.footer.links.partners, href: "#" },
    ],
    resources: [
      { label: t.footer.links.documentation, href: "#" },
      { label: t.footer.links.apiReference, href: "#" },
      { label: t.footer.links.blog, href: "#" },
      { label: t.footer.links.caseStudies, href: "#" },
    ],
    legal: [
      { label: t.footer.links.privacyPolicy, href: "#" },
      { label: t.footer.links.termsOfService, href: "#" },
      { label: t.footer.links.security, href: "#" },
    ],
  };

  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand — uses same logo as Navbar */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={nauticopsLogo} alt="NauticOps" className="h-14 w-auto" />
            </div>
            <p className="text-primary-foreground/60 mb-6 max-w-xs text-sm leading-relaxed">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground/8 hover:bg-primary-foreground/15 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          {[
            { title: t.footer.product, links: footerLinks.product },
            { title: t.footer.company, links: footerLinks.company },
            { title: t.footer.resources, links: footerLinks.resources },
            { title: t.footer.legal, links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
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
          <p className="text-xs text-primary-foreground/50">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
