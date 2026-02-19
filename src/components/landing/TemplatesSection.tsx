import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import templatePreview from "@/assets/template-preview.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const templates = [
  { name: "Modern Minimal", desc: "Clean single-column with generous whitespace", color: "#A0C878" },
  { name: "Corporate Executive", desc: "Formal structure for senior roles", color: "#1B365D" },
  { name: "Tech Professional", desc: "Two-column sidebar with skill badges", color: "#2D5016" },
  { name: "Creative Clean", desc: "Asymmetric layout with color blocks", color: "#D2691E" },
  { name: "Compact Professional", desc: "Dense layout for maximum content", color: "#4A4A4A" },
];

const TemplatesSection = () => (
  <section id="templates" className="py-20 px-4">
    <div className="container mx-auto max-w-6xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Templates</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">5 Professional Templates</h2>
        <p className="text-muted-foreground max-w-md mx-auto">ATS-friendly designs with accent color customization. Pick the one that fits your style.</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((t, i) => (
          <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
            <Card className="bg-background border-border/60 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden relative">
                  <img
                    src={templatePreview}
                    alt={`${t.name} CV template preview`}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: t.color }} />
                </div>
                <h3 className="font-sans font-semibold text-sm mb-0.5">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TemplatesSection;
