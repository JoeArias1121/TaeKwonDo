import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AppUser } from "@/auth/types";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function Signup() {
  const { content } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError(content.auth.passwords_mismatch);
      return;
    }
    
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create standard user profile in Firestore requiring approval
      const newUserProfile: AppUser = {
        uid: user.uid,
        email: user.email,
        role: "admin", 
        isApproved: false // Must be approved by a superadmin to login
      };

      await setDoc(doc(db, "users", user.uid), newUserProfile);
      
      // Navigate to pending approval screen
      navigate("/pending-approval");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create an account.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">{content.auth.signup_title}</h1>
          <p className="text-muted-foreground">{content.auth.signup_subtitle}</p>
        </div>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center">{error}</div>}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{content.auth.email}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{content.auth.password}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input/50 border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{content.auth.confirm_password}</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-input/50 border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? content.auth.signing_up : content.auth.signup}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {content.auth.has_account} <Link to="/login" className="text-primary font-bold hover:underline">{content.auth.log_in}</Link>
        </div>

        <div className="text-center mt-4 text-sm">
          <Link to="/" className="text-primary font-bold hover:underline transition-colors">
            &larr; {content.auth.back_to_site}
          </Link>
        </div>
      </div>
    </div>
  );
}
