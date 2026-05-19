import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { content } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // The header is approximately 100-120px tall
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: content.nav.home, path: "/" },
    { name: content.nav.about, path: "/aboutme" },
    { name: content.nav.members, path: "/members" },
    { name: content.nav.events, path: "/events" },
    { name: content.nav.contact, path: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm py-3"
          : "bg-background py-4"
      }`}
    >
      <div className="flex items-center w-full px-4 sm:px-6">
        <div className="flex-1">
          <button
            className="md:hidden p-2 -ml-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex flex-[2] justify-center items-center gap-8 font-heading">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-base font-semibold transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-foreground/80"
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full transition-all" />
              )}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-4 px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-md hover:bg-primary/90 transition-all"
          >
            {content.home.join_us}
          </Link>
        </div>

        {/* Right: Language Selector (Takes the place of TKD logo on mobile, sits far right on desktop) */}
        <div className="flex-1 flex justify-end">
          <LanguageSelector />
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-background border-b shadow-lg transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-medium p-2 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary/50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {/* Join Dojo Button inside mobile menu */}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 text-center py-3 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all"
          >
            {content.home.join_us}
          </Link>
        </div>
      </div>
    </nav>
  );
}
