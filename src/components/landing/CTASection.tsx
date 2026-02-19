import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 border border-primary/20 p-10 md:p-16 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to build your CV?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join thousands of professionals who trust CVCraft for their career. Start for free today.</p>
        <Button size="lg" className="text-base px-8" asChild>
          <Link to="/signup">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
