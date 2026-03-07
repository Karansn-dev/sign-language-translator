import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Translator", href: "/translator" },
    { label: "Speech to Sign", href: "/speech-to-sign" },
    { label: "Learning Center", href: "/learn" },
    { label: "Pricing", href: "/pricing" },
  ],
  Community: [
    { label: "Forum", href: "/community" },
    { label: "Blog", href: "#" },
    { label: "Events", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(256,86%,59%)] to-[hsl(259,100%,71%)] flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-display font-bold">इ</span>
              </div>
              <span className="font-display font-semibold text-lg text-foreground">Ishara</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bridging Silence and Sound. AI-powered Indian Sign Language translation for everyone.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ishara. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart size={12} className="text-accent fill-accent" /> for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
