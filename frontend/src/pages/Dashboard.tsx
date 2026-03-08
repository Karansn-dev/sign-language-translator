import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Camera, Mic, BookOpen, Users, ArrowRight, Clock,
  CheckCircle2, Award, HandMetal, Timer, Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

/* ── Stats ── */
const stats = [
  { label: "Signs Learned", value: 48, icon: HandMetal, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Achievements", value: 12, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Minutes Practiced", value: 320, icon: Timer, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

/* ── Feature Cards ── */
const featureCards = [
  {
    icon: Camera,
    title: "Sign Translation",
    description: "Translate sign language gestures into text and speech in real time using your camera.",
    cta: "Open Camera",
    href: "/translator",
    gradient: "from-blue-600 to-indigo-500",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(59,130,246,0.4)]",
  },
  {
    icon: Mic,
    title: "Speech to Sign",
    description: "Speak naturally and convert your words into animated sign language gestures instantly.",
    cta: "Start Speaking",
    href: "/speech-to-sign",
    gradient: "from-violet-600 to-purple-400",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(139,92,246,0.4)]",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description: "Interactive lessons, quizzes, and daily challenges to master Indian Sign Language.",
    cta: "Continue Learning",
    href: "/learn",
    meta: "24 lessons completed",
    gradient: "from-teal-500 to-cyan-400",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(20,184,166,0.4)]",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other learners, share your progress, and join discussion groups.",
    cta: "Explore Community",
    href: "/community",
    meta: "1.2k active members",
    gradient: "from-orange-500 to-amber-400",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(251,146,60,0.4)]",
  },
];

/* ── Recent Activity ── */
const recentActivity = [
  { action: "Completed lesson: Common Greetings", time: "25 min ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { action: "Translated 14 signs in a live session", time: "2 hours ago", icon: Camera, color: "text-blue-500", bg: "bg-blue-500/10" },
  { action: "Earned achievement: 7-Day Streak", time: "5 hours ago", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
  { action: "Joined the community group: ISL Beginners", time: "1 day ago", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  { action: "Completed quiz: Numbers & Counting", time: "2 days ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

/* ── Daily practice mock ── */
const dailyGoal = 20;
const dailyDone = 15;
const dailyPercent = Math.round((dailyDone / dailyGoal) * 100);

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* ── Welcome Section ── */}
          <motion.div {...fade(0)} className="mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">
              Welcome back, {user?.name || "User"}! 👋
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Every sign you learn brings you closer to someone's world. Keep going!
            </p>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fade(0.05 + i * 0.06)}
                className="rounded-2xl glass-card-static p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Daily Practice Progress ── */}
          <motion.div {...fade(0.25)} className="rounded-2xl glass-card-static p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-base text-foreground">Daily Practice</h2>
              <span className="text-sm text-muted-foreground">
                {dailyDone} of {dailyGoal} minutes
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                initial={{ width: 0 }}
                animate={{ width: `${dailyPercent}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {dailyPercent}% completed — {dailyGoal - dailyDone} more minutes to hit today's goal!
            </p>
          </motion.div>

          {/* ── Feature Cards (2×2) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {featureCards.map((card, i) => (
              <motion.div key={card.title} {...fade(0.3 + i * 0.08)}>
                <div className="block group h-full">
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[220px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${card.glow}`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-sm" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-sm" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                        <card.icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-1.5">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                        {card.description}
                      </p>
                      {card.meta && (
                        <p className="text-xs text-white/60 mt-2">{card.meta}</p>
                      )}
                    </div>

                    <div className="relative z-10 mt-4">
                      <Link to={card.href}>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                          {card.cta}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Recent Activity ── */}
          <motion.div {...fade(0.6)} className="rounded-2xl glass-card-static p-6">
            <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-5">
              <Clock size={18} className="text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  {...fade(0.65 + i * 0.05)}
                  className="flex items-start gap-4"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <item.icon size={16} className={item.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
