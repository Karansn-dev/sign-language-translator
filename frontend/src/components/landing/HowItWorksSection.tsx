import { motion } from "framer-motion";
import { Hand, Cpu, MessageCircle } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const steps = [
  {
    icon: Hand,
    step: "01",
    title: "Show Your Hands",
    description: "Position your hands in front of the camera and start signing naturally.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Detects Gesture",
    description: "Our AI model analyzes hand positions, movements, and facial expressions in real time.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Instant Translation",
    description: "See the translated text instantly and optionally hear the voice output.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-palette-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-palette-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary font-display uppercase tracking-widest">How It Works</span>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 mb-4"
          >
            Three simple steps
          </ScrollFloat>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start communicating in seconds with our intuitive translation flow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="text-center relative group"
            >
              <div className="rounded-2xl glass-card p-8 h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-6 relative">
                  <step.icon size={26} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(256,86%,59%)] to-[hsl(259,100%,71%)] text-white text-xs font-display font-bold flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
