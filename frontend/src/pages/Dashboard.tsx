import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, Mic, BookOpen, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const quickActions = [
  { icon: Camera, title: "Sign → Text", description: "Translate sign language in real time", href: "/translator", color: "bg-primary/10 text-primary" },
  { icon: Mic, title: "Speech → Sign", description: "Convert speech to sign language", href: "/speech-to-sign", color: "bg-accent/10 text-accent" },
  { icon: BookOpen, title: "Learn ISL", description: "Interactive lessons and challenges", href: "/learn", color: "bg-primary-glow/10 text-primary-glow" },
  { icon: Users, title: "Community", description: "Connect with ISL community", href: "/community", color: "bg-secondary text-secondary-foreground" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue your ISL journey. Here's what you can do today.
            </p>
          </motion.div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={action.href} className="block group">
                  <div className="rounded-2xl glass-card p-6">
                    <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon size={22} />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                    <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Activity & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl glass-card-static p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Recent Activity</h2>
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                No recent activity. Start translating to see your history!
              </div>
            </div>
            <div className="rounded-2xl glass-card-static p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Learning Progress</h2>
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                Start a lesson to track your progress here.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
