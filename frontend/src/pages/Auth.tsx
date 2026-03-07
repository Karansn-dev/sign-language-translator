import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-[10%] w-80 h-80 bg-palette-purple/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-palette-pink/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(256,86%,59%)] to-[hsl(259,100%,71%)] flex items-center justify-center shadow-elegant">
            <span className="text-primary-foreground font-display font-bold text-xl">इ</span>
          </div>
          <span className="font-display font-semibold text-2xl text-foreground">Ishara</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl glass-surface shadow-card p-8">
          <h1 className="font-display font-bold text-2xl text-foreground text-center mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isSignUp ? "Start your ISL learning journey" : "Sign in to continue learning"}
          </p>

          {/* Google OAuth */}
          <Button variant="outline" className="w-full mb-4 gap-2" size="lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <div className="space-y-3">
            {isSignUp && (
              <input
                type="text"
                placeholder="Full name"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button variant="hero" size="lg" className="w-full gap-2">
              <Mail size={16} />
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-5">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
