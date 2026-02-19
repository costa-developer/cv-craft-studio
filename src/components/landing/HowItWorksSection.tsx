import { motion } from "framer-motion";
import { UserPlus, PenTool, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  { icon: UserPlus, step: "01", title: "Sign Up & Choose Your Field", desc: "Create a free account and tell us your profession. Our AI generates a tailored CV instantly." },
  { icon: PenTool, step: "02", title: "Edit & Customize", desc: "Fine-tune your content with live preview, drag sections, upload your photo, and pick a template." },
  { icon: Download, step: "03", title: "Download & Apply", desc: "Export as PDF or DOCX and start applying. Your resume is ATS-optimized and ready to go." },
];

const HowItWorksSection = () => (
  <section className="py-20 px-4 bg-card/50">
    <div className="container mx-auto max-w-4xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">Ready in 3 simple steps</h2>
        <p className="text-muted-foreground max-w-md mx-auto">From sign-up to sending your resume — it takes just minutes.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <s.icon className="h-7 w-7 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary tracking-wider">STEP {s.step}</span>
            <h3 className="font-sans font-semibold text-lg mt-2 mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            {i < 2 && (
              <div className="hidden md:block absolute top-8 -right-4 w-8 h-[2px] bg-border" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
