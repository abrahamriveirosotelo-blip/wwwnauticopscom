import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const roleLabelMap: Record<string, string> = {};
    roleOptions.forEach((opt) => { roleLabelMap[opt.value] = opt.label; });
    const roleLabel = roleLabelMap[formData.role] || formData.role;

    try {
      const res = await fetch("https://formspree.io/f/mvzboodr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: roleLabel,
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const roleOptions = [
    { value: "port-authority", label: t.cta.form.roles.portAuthority },
    { value: "shipping-agent", label: t.cta.form.roles.shippingAgent },
    { value: "terminal-operator", label: t.cta.form.roles.terminalOperator },
    { value: "shipping-line", label: t.cta.form.roles.shippingLine },
    { value: "service-provider", label: t.cta.form.roles.serviceProvider },
    { value: "system-integrator", label: t.cta.form.roles.systemIntegrator },
    { value: "investor", label: t.cta.form.roles.investor },
    { value: "other", label: t.cta.form.roles.other },
  ];

  return (
    <section id="cta" className="section-padding bg-section-alt relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="heading-lg text-foreground mb-6 text-balance">
                {t.cta.title}
              </h2>
              <p className="body-lg text-muted-foreground mb-8">
                {t.cta.subtitle}
              </p>
              <ul className="space-y-4">
                {t.cta.benefits.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
                      <Check className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-xl">
              {!isSubmitted ? (
                <>
                  <h3 className="heading-sm text-foreground mb-6 text-center">
                    {t.cta.formTitle}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        {t.cta.form.name}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={t.cta.form.namePlaceholder}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t.cta.form.email}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.cta.form.emailPlaceholder}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        {t.cta.form.company}
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder={t.cta.form.companyPlaceholder}
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                        {t.cta.form.role}
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">{t.cta.form.rolePlaceholder}</option>
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button type="submit" variant="default" size="xl" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {t.cta.form.submit}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                    {error && (
                      <p className="text-sm text-destructive text-center">{error}</p>
                    )}
                    <p className="text-xs text-muted-foreground text-center">
                      {t.cta.form.disclaimer}
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mx-auto mb-6">
                    <Check className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="heading-sm text-foreground mb-3">
                    {t.cta.success.title}
                  </h3>
                  <p className="body-md text-muted-foreground">
                    {t.cta.success.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
