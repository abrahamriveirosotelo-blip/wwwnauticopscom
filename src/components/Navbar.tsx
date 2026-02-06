import { useState } from "react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";
import nauticopsLogo from "@/assets/nauticops-logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.problem, href: "#problem" },
    { label: t.nav.solution, href: "#solution" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.whoItsFor, href: "#who-its-for" },
    { label: t.nav.useCases, href: "#use-cases" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-brand">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between">
          <a href="#" className="flex items-center py-2">
            <img src={nauticopsLogo} alt="NauticOps" className="h-10 w-auto" />
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              {t.nav.viewPlatform}
            </Button>
            <Button variant="hero" size="sm">
              {t.nav.requestDemo}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
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
          <div className="lg:hidden py-4 border-t border-primary-foreground/10">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-primary-foreground/10">
                <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  {t.nav.viewPlatform}
                </Button>
                <Button variant="hero" size="sm">
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
