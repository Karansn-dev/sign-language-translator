import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, MessageCircle, Video } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">Community</h1>
            <p className="text-muted-foreground">Connect, share, and learn with the ISL community.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main feed */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { user: "Priya S.", time: "2h ago", content: "Just completed my 30-day ISL streak! 🎉 The daily challenges really help with consistency.", type: "post" },
                { user: "Arjun M.", time: "5h ago", content: "Can someone help me with the sign for 'thank you' in ISL? I keep confusing it with another gesture.", type: "question" },
                { user: "Neha K.", time: "1d ago", content: "Sharing my practice video for greetings module. Feedback welcome! 🤟", type: "video" },
              ].map((post, i) => (
                <div key={i} className="rounded-2xl glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display font-semibold text-sm text-primary">{post.user[0]}</span>
                    </div>
                    <div>
                      <span className="font-display font-medium text-sm text-foreground">{post.user}</span>
                      <span className="text-xs text-muted-foreground ml-2">{post.time}</span>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{post.type}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      <MessageCircle size={12} /> Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="rounded-2xl glass-card-static p-5">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-primary" /> Trending
                </h3>
                {["#ISLChallenge", "#LearnISL", "#AccessibilityFirst", "#SignLanguageDay"].map((tag) => (
                  <div key={tag} className="py-2 text-sm text-primary hover:text-primary/80 cursor-pointer transition-colors">{tag}</div>
                ))}
              </div>
              <div className="rounded-2xl glass-card-static p-5">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Users size={16} className="text-primary" /> Online Now
                </h3>
                <p className="text-sm text-muted-foreground">Sign in to see community members online.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
