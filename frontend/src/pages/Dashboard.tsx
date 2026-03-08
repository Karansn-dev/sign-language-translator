import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Camera, Mic, BookOpen, Users, ArrowRight, Clock,
  CheckCircle2, MessageSquare, Award, Settings, Bell,
  Zap, TrendingUp, History,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

/* ── Action Cards ── */
const actionCards = [
  {
    icon: Camera,
    title: "Start Translating",
    description: "Engage in real-time conversations with our advanced ISL translation.",
    cta: "Launch Translator",
    href: "/translator",
    gradient: "from-bg-gradient-to-r from-pink-300 via-purple-500 to-indigo-700",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(59,130,246,0.4)]",
    iconBg: "bg-white/20",
  },
  {
    icon: Mic,
    title: "Start Talking",
    description: "Convert your speech into ISL gestures instantly.",
    cta: "Open Talk-to-Sign",
    href: "/speech-to-sign",
    gradient: "from-purple-500 to-violet-400",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(139,92,246,0.4)]",
    iconBg: "bg-white/20",
  },
  {
    icon: BookOpen,
    title: "Continue Your Learning Journey",
    description: "Master ISL with interactive lessons and personalized feedback.",
    cta: "Start Learning Now",
    href: "/learn",
    gradient: "from-blue-600 to-teal-400",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(20,184,166,0.4)]",
    iconBg: "bg-white/20",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with learners, share experiences, and grow together.",
    cta: "Explore Community",
    href: "/community",
    gradient: "from-orange-400 to-yellow-300",
    glow: "group-hover:shadow-[0_8px_40px_-8px_rgba(251,146,60,0.4)]",
    iconBg: "bg-white/20",
  },
];

/* ── Mock data ── */
const recentTranslations = [
  { sentence: "Hello, how are you?", time: "2 hours ago", accuracy: 96 },
  { sentence: "Thank you very much", time: "5 hours ago", accuracy: 92 },
  { sentence: "Nice to meet you", time: "1 day ago", accuracy: 89 },
  { sentence: "Good morning everyone", time: "2 days ago", accuracy: 94 },
];

const communityActivity = [
  { user: "Priya S.", action: "completed ISL Greetings course", icon: Award, time: "10 min ago" },
  { user: "Arjun K.", action: "shared a learning story", icon: MessageSquare, time: "30 min ago" },
  { user: "Meera R.", action: "answered a community question", icon: CheckCircle2, time: "1 hr ago" },
  { user: "Rahul D.", action: "reached a 7-day streak", icon: Zap, time: "2 hrs ago" },
  { user: "Ananya P.", action: "completed Numbers & Counting", icon: Award, time: "3 hrs ago" },
];

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
        <div className="container mx-auto px-6">

          {/* ── Welcome Section ── */}
          <motion.div {...fade(0)} className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">
                Welcome, {user?.name || "User"}! 👋
              </h1>
              <p className="text-muted-foreground text-base md:text-lg">
                Continue your journey towards inclusive communication.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-xl">
                <Bell size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Settings size={18} />
              </Button>
            </div>
          </motion.div>

          {/* ── Main Action Cards (2×2) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {actionCards.map((card, i) => (
              <motion.div key={card.title} {...fade(0.08 + i * 0.08)}>
                <Link to={card.href} className="block group">
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${card.gradient} p-6 min-h-[180px] flex flex-col justify-between overflow-hidden transition-all duration-400 ${card.glow}`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-sm" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-sm" />

                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl ${card.iconBg} backdrop-blur-sm flex items-center justify-center mb-4`}>
                        <card.icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-1.5">
                        {card.title}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                        {card.description}
                      </p>
                    </div>

                    <div className="relative z-10 mt-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl group-hover:bg-white/30 transition-colors">
                        {card.cta}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── Bottom Grid: Translations + Community + Quick Settings ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Translations (spans 2 cols on lg) */}
            <motion.div {...fade(0.5)} className="lg:col-span-2 rounded-2xl glass-card-static p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <History size={18} className="text-primary" />
                  Recent Translations
                </h2>
                <Link to="/translator" className="text-xs text-primary hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recentTranslations.map((item, i) => (
                  <motion.div
                    key={i}
                    {...fade(0.55 + i * 0.06)}
                    className="flex items-center justify-between rounded-xl border border-border bg-card/50 p-4 hover:bg-card transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        "{item.sentence}"
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock size={12} /> {item.time}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-1.5 shrink-0">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-8 text-right">
                        {item.accuracy}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Community + Quick Settings */}
            <div className="space-y-6">
              {/* Community Activity */}
              <motion.div {...fade(0.6)} className="rounded-2xl glass-card-static p-6">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-primary" />
                  Community Activity
                </h2>
                <div className="space-y-3">
                  {communityActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground leading-snug">
                          <span className="font-semibold">{item.user}</span>{" "}
                          <span className="text-muted-foreground">{item.action}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/community"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-4"
                >
                  See All Activity <ArrowRight size={12} />
                </Link>
              </motion.div>

              {/* Quick Settings */}
              <motion.div {...fade(0.7)} className="rounded-2xl glass-card-static p-6">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-4">
                  <Settings size={18} className="text-primary" />
                  Quick Settings
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Camera Preferences", href: "/translator" },
                    { label: "Language Settings", href: "/speech-to-sign" },
                    { label: "Notification Preferences", href: "#" },
                    { label: "Manage Account", href: "#" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground hover:bg-card transition-colors group"
                    >
                      {link.label}
                      <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
