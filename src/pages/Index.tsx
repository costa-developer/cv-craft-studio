import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileText, Sparkles, Download, Eye, LayoutTemplate, Shield,
  Check, ArrowRight, Zap, PenTool, BarChart3
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: LayoutTemplate, title: "5 ATS-Friendly Templates", desc: "Professional designs that pass applicant tracking systems." },
  { icon: Eye, title: "Live Preview Editor", desc: "See changes instantly as you type in a realistic A4 layout." },
  { icon: Sparkles, title: "AI-Powered Writing", desc: "Generate summaries and improve bullet points with AI." },
  { icon: Download, title: "PDF & DOCX Export", desc: "Server-rendered, high-quality exports ready to send." },
  { icon: Shield, title: "ATS Optimized", desc: "Clean markup and structure that recruiters' systems love." },
  { icon: BarChart3, title: "Resume Strength Score", desc: "Get real-time feedback on completeness and impact." },
];

const templates = [
  { name: "Modern Minimal", desc: "Clean single-column with generous whitespace" },
  { name: "Corporate Executive", desc: "Formal structure suited for senior roles" },
  { name: "Tech Professional", desc: "Two-column sidebar layout with skill badges" },
  { name: "Creative Clean", desc: "Asymmetric layout with subtle color blocks" },
  { name: "Compact Professional", desc: "Dense layout for maximum content" },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 CV", "2 basic templates", "PDF export with watermark", "Basic editor"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    features: ["Unlimited CVs", "All 5 templates", "No watermark", "AI features unlocked", "DOCX export", "Public sharing links", "Priority support"],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
              Build your perfect CV in minutes
            </span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6"
          >
            Craft CVs that
            <span className="text-primary"> land interviews</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Professional, ATS-friendly resumes with live preview, AI writing assistance, and beautiful templates — all in one place.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#templates">View Templates</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Everything you need</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Powerful tools to build, polish, and export your professional resume.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full border-border/60 bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                      <f.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-sans font-semibold text-base mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">5 Professional Templates</h2>
            <p className="text-muted-foreground max-w-md mx-auto">ATS-friendly designs with accent color customization.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {templates.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="bg-background border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                      <FileText className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="font-sans font-semibold text-sm mb-1">{t.name}</h3>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Simple pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className={`h-full ${plan.highlighted ? "border-primary shadow-lg ring-1 ring-primary/20" : "border-border/60"}`}>
                  <CardContent className="p-8">
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

      {/* CTA */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to build your CV?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of professionals who trust CVCraft for their career.</p>
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
