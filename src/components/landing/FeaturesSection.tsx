import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  LayoutTemplate, Eye, Sparkles, Download, Shield, BarChart3,
  Image, Globe, Lock
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  { icon: LayoutTemplate, title: "5 ATS-Friendly Templates", desc: "Professional designs optimized to pass applicant tracking systems and impress recruiters." },
  { icon: Eye, title: "Live Preview Editor", desc: "See every change instantly in a realistic A4 layout as you type. No guesswork." },
  { icon: Sparkles, title: "AI-Powered Writing", desc: "Generate professional summaries and improve bullet points with one click." },
  { icon: Download, title: "PDF & DOCX Export", desc: "Download high-quality, multi-page PDF or Word documents ready to send." },
  { icon: Image, title: "Photo Upload", desc: "Add a professional headshot to make your CV stand out visually." },
  { icon: BarChart3, title: "Resume Strength Score", desc: "Get AI-powered feedback on completeness, impact, and keyword optimization." },
  { icon: Shield, title: "ATS Optimized", desc: "Clean markup and semantic structure that recruiters' systems love." },
  { icon: Globe, title: "Public Sharing Links", desc: "Share your CV with a unique public URL — perfect for portfolios and applications." },
  { icon: Lock, title: "Secure & Private", desc: "Your data is encrypted and stored securely. Only you control who sees your CV." },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 px-4">
    <div className="container mx-auto max-w-6xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Features</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">Everything you need to land the job</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Powerful tools to build, polish, and export your professional resume — all in one place.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
            <Card className="h-full border-border/60 bg-card hover:shadow-md hover:border-primary/30 transition-all group">
              <CardContent className="p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-sans font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
