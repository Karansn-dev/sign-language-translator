import { useState, useEffect, MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Learn", href: "/learn" },
  { label: "Community", href: "/community" },
];

const sectionNavIds = ["features", "how-it-works", "pricing"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const updateActiveSection = () => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const navbarOffset = 140;
    let currentSection = "";

    for (const id of sectionNavIds) {
      const section = document.getElementById(id);
      if (!section) continue;

      if (window.scrollY >= section.offsetTop - navbarOffset) {
        currentSection = id;
      }
    }

    setActiveSection((prev) => (prev === currentSection ? prev : currentSection));
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const navbarOffset = 96;
    const top = section.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (location.pathname !== "/") {
      return;
    }

    event.preventDefault();
    setMobileOpen(false);
    setActiveSection(sectionId);
    scrollToSection(sectionId);
    window.history.replaceState(null, "", `/#${sectionId}`);
  };

  const isNavItemActive = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2);
      return location.pathname === "/" && activeSection === sectionId;
    }

    return location.pathname === href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      updateActiveSection();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.slice(1);
    const timerId = window.setTimeout(() => {
      scrollToSection(sectionId);
      setActiveSection(sectionId);
    }, 80);
    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-surface shadow-card py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Ishara Home">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(256,86%,59%)] to-[hsl(259,100%,71%)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-elegant">
            <span className="text-primary-foreground font-display font-bold text-lg">इ</span>
          </div>
          <span className="font-display font-semibold text-xl text-foreground">
            Ishara
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={(event) => {
                if (item.href.startsWith("/#")) {
                  handleSectionClick(event, item.href.slice(2));
                }
              }}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isNavItemActive(item.href)
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-display font-bold text-sm">
                  {user!.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                  {user!.name}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-surface shadow-card border border-border p-1.5 z-50"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <User size={15} /> Profile
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => { logout(); setProfileOpen(false); navigate("/"); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors w-full"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          )}
          {!isAuthenticated && (
            <Link to="/translator">
              <Button variant="hero" size="sm">Start Translating</Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-surface border-t border-border"
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(event) => {
                    if (item.href.startsWith("/#")) {
                      handleSectionClick(event, item.href.slice(2));
                    }
                  }}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isNavItemActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full gap-2">
                        <LayoutDashboard size={15} /> Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full gap-2 text-destructive hover:text-destructive"
                      onClick={() => { logout(); navigate("/"); }}
                    >
                      <LogOut size={15} /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                )}
                {!isAuthenticated && (
                  <Link to="/translator">
                    <Button variant="hero" className="w-full">Start Translating</Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
