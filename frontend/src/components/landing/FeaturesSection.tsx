import { motion } from "framer-motion";
import { Camera, Brain, MessageSquare, Volume2, BookOpen, Users } from "lucide-react";
import ScrollFloat from "@/components/ScrollFloat";

const features = [
  {
    icon: Camera,
    title: "Real-Time Detection",
    description: "Advanced computer vision detects hand gestures instantly through your camera with high accuracy.",
  },
  {
    icon: Brain,
    title: "AI-Powered Translation",
    description: "Deep learning models trained on thousands of ISL signs deliver context-aware translations.",
  },
  {
    icon: MessageSquare,
    title: "Sentence Builder",
    description: "Automatically constructs meaningful sentences from detected signs with grammar correction.",
  },
  {
    icon: Volume2,
    title: "Voice Output",
    description: "Convert translated text to natural speech, enabling two-way communication effortlessly.",
  },
  {
    icon: BookOpen,
    title: "Learning Platform",
    description: "Interactive lessons, practice exercises, and daily challenges to learn Indian Sign Language.",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with the ISL community, share experiences, and learn from native signers.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary font-display uppercase tracking-widest">Features</span>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 mb-4"
            textClassName="text-gradient-full"
          >
            Everything you need to communicate
          </ScrollFloat>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From real-time translation to interactive learning — Ishara provides a complete ecosystem for ISL communication.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative rounded-2xl p-7 glass-card cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
