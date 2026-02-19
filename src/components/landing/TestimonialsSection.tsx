import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const testimonials = [
  { name: "Sarah K.", role: "Marketing Manager", text: "CVCraft's AI generated an amazing summary and the templates look so professional. Got 3 interviews in the first week!", rating: 5 },
  { name: "James P.", role: "Software Engineer", text: "The live preview saved me so much time. I could see exactly how my CV would look as I typed. Best resume builder I've used.", rating: 5 },
  { name: "Maria L.", role: "UX Designer", text: "Love the photo upload and public sharing features. I embedded my CV link right into my portfolio site. Brilliant!", rating: 5 },
];

const TestimonialsSection = () => (
  <section className="py-20 px-4 bg-card/50">
    <div className="container mx-auto max-w-5xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-3">Loved by professionals</h2>
        <p className="text-muted-foreground max-w-md mx-auto">See what our users say about their experience with CVCraft.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}>
            <Card className="h-full border-border/60">
              <CardContent className="p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
