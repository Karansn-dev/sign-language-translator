import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, Eye } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[15%] w-72 h-72 rounded-full bg-palette-purple/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-[10%] w-96 h-96 rounded-full bg-palette-pink/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-palette-lavender/10 blur-3xl animate-pulse-glow" />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-surface border-primary/20 mb-8 text-sm text-muted-foreground"
          >
            <Sparkles size={14} className="text-primary" />
            <span>AI-Powered Sign Language Translation</span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6">
            Speak the Language{" "}
            <span className="text-gradient-full">of Hands</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ishara uses AI-powered computer vision to translate Indian Sign Language in real time — bridging communication between deaf and hearing communities across India.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/translator">
              <Button variant="hero" size="xl" className="gap-2.5">
                Start Translating
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl" className="gap-2.5">
              <Play size={16} />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-14"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Sparkles size={12} className="text-primary" />
              </div>
              Powered by AI
            </div>
            <div className="w-px h-4 bg-primary/20" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Eye size={12} className="text-primary" />
              </div>
              Computer Vision Enabled
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
