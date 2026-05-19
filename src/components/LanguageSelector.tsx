import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector({ 
  compact = false, 
  align = "right" 
}: { 
  compact?: boolean; 
  align?: "left" | "right"; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "EN", name: "English" },
    { code: "es", label: "ES", name: "Español" },
  ];

  const selectedLangLabel = languages.find(l => l.code === language)?.label || "EN";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as "en" | "es");
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block text-left"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center rounded-full bg-secondary/50 hover:bg-secondary text-sm font-semibold text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          compact ? "w-10 h-10 p-0" : "w-full px-4 py-2"
        }`}
        title={compact ? `Language: ${selectedLangLabel}` : ""}
      >
        <Globe size={16} className={compact ? "text-muted-foreground" : "text-muted-foreground mr-2"} />
        {!compact && selectedLangLabel}
        {!compact && <ChevronDown size={16} className="text-muted-foreground ml-2" />}
      </button>

      {/* Custom Dropdown Menu */}
      <div
        className={`absolute ${align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right"} z-50 mt-2 w-40 rounded-xl bg-card border shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out ${
          isOpen
            ? "transform opacity-100 scale-100 visible"
            : "transform opacity-0 scale-95 invisible"
        }`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-secondary hover:text-foreground ${
                language === lang.code
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground/80"
              }`}
              role="menuitem"
            >
              <span className="inline-block w-10 font-semibold">
                {lang.label}
              </span>
              <span className="text-muted-foreground">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
