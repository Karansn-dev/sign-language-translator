import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-palette-purple/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-palette-pink/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-5"
          >
            Ready to bridge the gap?
          </ScrollFloat>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of users already using Ishara to communicate, learn, and connect through Indian Sign Language.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/translator">
              <Button variant="hero" size="xl" className="gap-2">
                Get Started Free
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="hero-outline" size="xl">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
