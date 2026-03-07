import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function ImpactSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(252,40%,8%)] via-[hsl(256,50%,12%)] to-[hsl(252,40%,8%)]" />

      {/* Glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-palette-purple/8 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="text-sm font-medium text-palette-lavender font-display uppercase tracking-widest">Impact</span>

          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mt-4 mb-6 leading-tight text-white">
            <span className="text-gradient-accent">
              <AnimatedNumber target={63} /> million
            </span>{" "}
            people in India are deaf or hard of hearing
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Ishara is on a mission to make communication accessible for everyone. With AI-powered translation, we're breaking barriers one gesture at a time.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 63, suffix: "M+", label: "Deaf individuals in India" },
              { value: 300, suffix: "+", label: "ISL signs supported" },
              { value: 98, suffix: "%", label: "Detection accuracy" },
              { value: 50, suffix: "ms", label: "Response time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl text-palette-lavender mb-1">
                  <AnimatedNumber target={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
