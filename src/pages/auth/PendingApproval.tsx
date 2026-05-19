import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function PendingApproval() {
  const { content } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleReturnToLogin = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full mx-auto flex items-center justify-center font-heading font-black text-2xl mb-6">
          !
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">{content.auth.pending_title}</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          {content.auth.pending_subtitle}
        </p>
        
        <div className="flex flex-col gap-3">
            <Link 
                to="/" 
                className="w-full border border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-all block"
            >
                {content.auth.return_to_site}
            </Link>
            <button 
                onClick={handleReturnToLogin}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4"
            >
                {content.auth.return_to_login}
            </button>
        </div>
      </div>
    </div>
  );
}
