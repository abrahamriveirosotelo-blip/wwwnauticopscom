import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="cta" className="section-padding hero-gradient hero-pattern relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h2 className="heading-lg text-primary-foreground mb-6 text-balance">
                Ready to Improve Port Call Coordination?
              </h2>
              <p className="body-lg text-primary-foreground/80 mb-8">
                Request a demo to see how NauticOps can create unified visibility 
                for your port operations—without disrupting your existing systems.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized platform walkthrough",
                  "Discussion of your specific use cases",
                  "Integration assessment for your systems",
                  "Pilot program options",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-xl">
              {!isSubmitted ? (
                <>
                  <h3 className="heading-sm text-foreground mb-6 text-center">
                    Request a Demo
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Work Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                        Company / Organization
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="Port of Barcelona"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                        Your Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select your role</option>
                        <option value="port-authority">Port Authority</option>
                        <option value="shipping-agent">Shipping Agent</option>
                        <option value="terminal-operator">Terminal Operator</option>
                        <option value="shipping-line">Shipping Line</option>
                        <option value="service-provider">Service Provider</option>
                        <option value="system-integrator">System Integrator</option>
                        <option value="investor">Investor / Partner</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Button type="submit" variant="cta" size="xl" className="w-full">
                      Request Demo
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We'll get back to you within 24 hours. No spam, ever.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean/10 mx-auto mb-6">
                    <Check className="h-8 w-8 text-ocean" />
                  </div>
                  <h3 className="heading-sm text-foreground mb-3">
                    Thank You!
                  </h3>
                  <p className="body-md text-muted-foreground">
                    We've received your request and will be in touch within 24 hours 
                    to schedule your personalized demo.
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
