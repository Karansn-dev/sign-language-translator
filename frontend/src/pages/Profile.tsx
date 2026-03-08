import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  User, Mail, Camera, Shield, Bell, Globe, Flame,
  Star, BookOpen, Trophy, LogOut, Save, Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
});

const stats = [
  { icon: Flame, label: "Day Streak", value: "7", color: "text-orange-500" },
  { icon: Star, label: "Total XP", value: "1,250", color: "text-yellow-500" },
  { icon: BookOpen, label: "Lessons Done", value: "12", color: "text-blue-500" },
  { icon: Trophy, label: "Rank", value: "Silver", color: "text-purple-500" },
];

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("Passionate about learning Indian Sign Language and building inclusive communication.");
  const [language, setLanguage] = useState("en-IN");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    if (name && email) {
      login(name, email);
    }
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* ── Profile Header ── */}
          <motion.div {...fade(0)} className="rounded-2xl glass-card-static p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-display font-bold text-4xl shadow-elegant">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <button className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="space-y-3 max-w-sm">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Short bio"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                    <div className="flex gap-2">
                      <Button variant="hero" size="sm" className="gap-2" onClick={handleSave}>
                        <Save size={14} /> Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-1">
                      {user?.name || "User"}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                      <Mail size={14} /> {user?.email || "user@example.com"}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md mb-4">{bio}</p>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
                      <Edit3 size={14} /> Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Stats ── */}
          <motion.div {...fade(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl glass-card-static p-4 text-center">
                <s.icon size={22} className={`${s.color} mx-auto mb-2`} />
                <div className="font-display font-bold text-xl text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Settings Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Account Settings */}
            <motion.div {...fade(0.2)} className="rounded-2xl glass-card-static p-6">
              <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-5">
                <Shield size={18} className="text-primary" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Auth</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <button
                    className="w-11 h-6 rounded-full bg-muted relative transition-colors cursor-pointer"
                    aria-label="Toggle two-factor auth"
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Password</p>
                  <p className="text-xs text-muted-foreground mb-2">Last changed 30 days ago</p>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Connected Accounts</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/50 text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div {...fade(0.3)} className="rounded-2xl glass-card-static p-6">
              <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2 mb-5">
                <User size={18} className="text-primary" />
                Preferences
              </h2>
              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                    <Globe size={14} /> Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">हिन्दी (Hindi)</option>
                    <option value="mr-IN">मराठी (Marathi)</option>
                    <option value="ta-IN">தமிழ் (Tamil)</option>
                  </select>
                </div>

                <div className="h-px bg-border" />

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Notifications</p>
                      <p className="text-xs text-muted-foreground">Email & push alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${notifications ? "bg-primary" : "bg-muted"}`}
                    aria-label="Toggle notifications"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${notifications ? "translate-x-[22px]" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <div className="h-px bg-border" />

                {/* Camera default */}
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                    <Camera size={14} /> Default Camera
                  </label>
                  <select className="w-full h-10 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>System Default</option>
                    <option>Front Camera</option>
                    <option>External Webcam</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Danger Zone ── */}
          <motion.div {...fade(0.4)} className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">Danger Zone</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Sign Out</p>
                <p className="text-xs text-muted-foreground">Sign out from your account on this device.</p>
              </div>
              <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </Button>
            </div>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
