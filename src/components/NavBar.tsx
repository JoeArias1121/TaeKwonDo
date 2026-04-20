import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // The header is approximately 100-120px tall
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/aboutme" },
    { name: "Members", path: "/members" },
    { name: "Events", path: "/events" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm py-3"
          : "bg-background py-4"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between md:justify-center items-center">
        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-heading">
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
            Join Dojo
          </Link>
        </div>

        {/* Small Brand on Mobile only */}
        <div className="md:hidden font-heading font-bold text-lg text-primary tracking-tight">
           TKD
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
        </div>
      </div>
    </nav>
  );
}
