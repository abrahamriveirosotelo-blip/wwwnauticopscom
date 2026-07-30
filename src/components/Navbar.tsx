import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import nauticopsLogo from "@/assets/nauticops-logo.png";
import { trackCtaClick, trackPlatformClick } from "@/lib/analytics";
import { shippingAgentsEn, shippingAgentsEs } from "@/lib/translations/shippingAgents";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const saT = language === "es" ? shippingAgentsEs : shippingAgentsEn;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: t.nav.context, href: "#context" },
    { label: t.nav.solution, href: "#solution" },
    { label: t.nav.howItFits, href: "#how-it-fits" },
    { label: t.nav.whoItsFor, href: "#who-its-for" },
    { label: t.nav.useCases, href: "#use-cases" },
    { label: t.nav.about, href: "#about" },
  ];

  return (
    <nav className="nav-brand fixed left-0 right-0 top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={menuRef}>
        <div className="flex h-[6.5rem] items-center justify-between">
          <a href="#" className="flex items-center">
            <img src={nauticopsLogo} alt="NauticOps" className="h-[4.5rem] w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/for-shipping-agents"
              className="rounded-full border border-secondary/30 px-3 py-1 text-sm font-semibold text-secondary transition-colors hover:border-secondary/60 hover:text-secondary/80"
            >
              {saT.nav.link}
            </Link>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher variant="dark" />
            <a
              href="https://www.nauticops.com/demo/marin"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPlatformClick("navbar")}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {t.nav.viewPlatform}
              </Button>
            </a>
            <Button
              variant="hero"
              size="sm"
              onClick={() => {
                trackCtaClick("navbar");
                document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => document.getElementById("name")?.focus(), 800);
              }}
            >
              {t.nav.requestDemo}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher variant="dark" />
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? (
                <X className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-primary-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-primary-foreground/10 py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/for-shipping-agents"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-secondary transition-colors hover:text-secondary/80"
              >
                {saT.nav.link} →
              </Link>
              <div className="flex flex-col gap-2 border-t border-primary-foreground/10 pt-4">
                <a
                  href="https://www.nauticops.com/demo/marin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    {t.nav.viewPlatform}
                  </Button>
                </a>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => {
                    trackCtaClick("navbar");
                    setIsOpen(false);
                    document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => document.getElementById("name")?.focus(), 800);
                  }}
                >
                  {t.nav.requestDemo}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
