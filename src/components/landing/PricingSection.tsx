import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 CV", "2 basic templates", "PDF export with watermark", "Basic editor", "Photo upload"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: ["Unlimited CVs", "All 5 templates", "No watermark", "AI writing features", "PDF & DOCX export", "Public sharing links", "Priority support"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-20 px-4">
    <div className="container mx-auto max-w-3xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">Simple, transparent pricing</h2>
        <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {pricingPlans.map((plan, i) => (
          <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
            <Card className={`h-full ${plan.highlighted ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border/60"}`}>
              <CardContent className="p-8">
                {plan.highlighted && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">Most Popular</span>
                )}
                <h3 className="font-sans font-semibold text-lg mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
