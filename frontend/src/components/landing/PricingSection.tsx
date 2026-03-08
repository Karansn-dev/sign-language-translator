import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with basic translation features.",
    features: ["Basic sign detection", "5 translations/day", "ISL alphabet access", "Community access"],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "Unlimited translations and full learning platform.",
    features: ["Unlimited translations", "Voice output", "Full learning center", "Daily challenges", "Priority support", "Save & export"],
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For hospitals, schools, and government services.",
    features: ["Everything in Pro", "Custom API access", "Bulk licensing", "On-premise deployment", "Dedicated support", "Custom training"],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary font-display uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free and upgrade as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "glass-surface shadow-elegant border-primary/30 border"
                  : "glass-surface shadow-card hover:shadow-card-hover"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[hsl(256,86%,59%)] to-[hsl(259,100%,71%)] text-white text-xs font-display font-semibold rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={10} /> Most Popular
                </div>
              )}
              <h3 className="font-display font-semibold text-xl text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-bold text-3xl text-foreground">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <Link to="/pricing">
                <Button variant={plan.variant} className="w-full mb-6">{plan.cta}</Button>
              </Link>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check size={14} className="text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
