import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import heroImage from "@/assets/hero-resume-builder.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const HeroSection = () => (
  <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden">
    {/* Subtle gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-background -z-10" />
    
    <div className="container mx-auto max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              ✨ AI-Powered Resume Builder
            </span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6"
          >
            Build Your Resume.{" "}
            <span className="text-primary">Land More Interviews.</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            Create professional, ATS-friendly resumes in minutes with AI writing assistance, 
            live preview, and beautiful templates.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button size="lg" className="text-base px-8" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <a href="#templates">View Templates</a>
            </Button>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No credit card required", "5 ATS templates", "AI writing assistant"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — hero image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/60">
            <img
              src={heroImage}
              alt="CVCraft resume builder showing live preview editor with a professional CV template"
              className="w-full h-auto"
              loading="eager"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold">ATS Score</p>
                <p className="text-lg font-bold text-primary">92%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto"
      >
        {[
          { value: "10K+", label: "Resumes Created" },
          { value: "92%", label: "ATS Pass Rate" },
          { value: "5", label: "Pro Templates" },
          { value: "Free", label: "To Get Started" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
