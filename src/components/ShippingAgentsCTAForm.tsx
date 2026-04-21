import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";
import type { ShippingAgentsTranslations } from "@/lib/translations/shippingAgents";

type Props = { t: ShippingAgentsTranslations["form"] };

const ShippingAgentsCTAForm = ({ t }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    role: "",
    port: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formStarted = useRef(false);

  const roleOptions = [
    { value: "port-agent", label: t.roles.portAgent },
    { value: "pilot-station", label: t.roles.pilotStation },
    { value: "tug-company", label: t.roles.tugCompany },
    { value: "mooring-company", label: t.roles.mooringCompany },
    { value: "terminal", label: t.roles.terminal },
    { value: "port-authority", label: t.roles.portAuthority },
    { value: "service-provider", label: t.roles.serviceProvider },
    { value: "other", label: t.roles.other },
  ];

  const handleFocus = () => {
    if (!formStarted.current) {
      formStarted.current = true;
      try { trackFormStart(); } catch { /* analytics must not break UX */ }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try { trackFormSubmit(formData.role); } catch { /* analytics must not break UX */ }

    try {
      const res = await fetch("https://formspree.io/f/mvzboodr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          role: formData.role,
          port: formData.port || "—",
          _source: "for-shipping-agents",
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(t.errorFallback);
      }
    } catch {
      setError(t.errorFallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mx-auto mb-6">
          <Check className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="heading-sm text-foreground mb-3">{t.success.title}</h3>
        <p className="body-md text-muted-foreground">{t.success.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={handleFocus} className="space-y-4">
      <div>
        <label htmlFor="sa-name" className="block text-sm font-medium text-foreground mb-2">
          {t.name}
        </label>
        <Input
          id="sa-name"
          name="name"
          type="text"
          placeholder={t.namePlaceholder}
          value={formData.name}
          onChange={handleChange}
          required
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="sa-company" className="block text-sm font-medium text-foreground mb-2">
          {t.company}
        </label>
        <Input
          id="sa-company"
          name="company"
          type="text"
          placeholder={t.companyPlaceholder}
          value={formData.company}
          onChange={handleChange}
          required
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="sa-email" className="block text-sm font-medium text-foreground mb-2">
          {t.email}
        </label>
        <Input
          id="sa-email"
          name="email"
          type="email"
          placeholder={t.emailPlaceholder}
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12"
        />
      </div>

      <div>
        <label htmlFor="sa-role" className="block text-sm font-medium text-foreground mb-2">
          {t.role}
        </label>
        <select
          id="sa-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">{t.rolePlaceholder}</option>
          {roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sa-port" className="block text-sm font-medium text-foreground mb-2">
          {t.port}
        </label>
        <Input
          id="sa-port"
          name="port"
          type="text"
          placeholder={t.portPlaceholder}
          value={formData.port}
          onChange={handleChange}
          className="h-12"
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="xl"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {t.submit}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <p className="text-xs text-muted-foreground text-center">{t.disclaimer}</p>
    </form>
  );
};

export default ShippingAgentsCTAForm;
