import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Flame, Star } from "lucide-react";
import { motion } from "framer-motion";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = "123456789".split("");

function FlipCard({ label, delay }: { label: string; delay: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="aspect-square cursor-pointer [perspective:600px]"
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-xl glass-card-static flex items-center justify-center font-display font-semibold text-lg text-foreground hover:bg-primary/10 hover:shadow-card-hover [backface-visibility:hidden]">
          {label}
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-xl glass-card-static flex flex-col items-center justify-center overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <img
            src={`/api/signs/${label}`}
            alt={`Sign for ${label}`}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="absolute bottom-1 text-[10px] font-bold text-foreground bg-background/70 px-1.5 rounded">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearnPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Learning Center
            </h1>
            <p className="text-muted-foreground">Master Indian Sign Language step by step.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Flame, label: "Day Streak", value: "0" },
              { icon: Star, label: "XP Earned", value: "0" },
              { icon: BookOpen, label: "Lessons Done", value: "0" },
              { icon: Trophy, label: "Rank", value: "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl glass-card-static p-4 text-center">
                <s.icon size={20} className="text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-xl text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ISL Alphabet Grid */}
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">ISL Alphabet</h2>
          <p className="text-sm text-muted-foreground mb-3">Click any card to see the hand gesture</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 mb-12">
            {alphabet.map((letter, idx) => (
              <FlipCard key={letter} label={letter} delay={idx * 0.02} />
            ))}
          </div>

          {/* ISL Numbers Grid */}
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">ISL Numbers</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-12">
            {numbers.map((num, idx) => (
              <FlipCard key={num} label={num} delay={idx * 0.02} />
            ))}
          </div>

          {/* Lesson modules placeholder */}
          <h2 className="font-display font-semibold text-xl text-foreground mb-4">Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {["Greetings & Basics", "Numbers & Counting", "Daily Conversations", "Family & Relationships", "Emergency Signs", "Medical Communication"].map((lesson, i) => (
              <div key={lesson} className="rounded-2xl glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen size={18} className="text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-display">Lesson {i + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{lesson}</h3>
                <p className="text-sm text-muted-foreground mb-4">Learn essential signs for {lesson.toLowerCase()}.</p>
                <Button variant="outline" size="sm">Start Lesson</Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
