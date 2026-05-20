import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export default function Login() {
  const { content } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait to redirect, AuthContext will catch the user and ProtectedRoute will direct them
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError(content.auth.invalid_login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-lg relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px] pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-primary text-white rounded-xl mx-auto flex items-center justify-center font-heading font-black text-xl mb-4 shadow-md">
            TKD
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">
            {content.auth.login_title}
          </h1>
          <p className="text-muted-foreground">{content.auth.login_subtitle}</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 relative z-10"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {content.auth.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {content.auth.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input/50 border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? content.auth.signing_in : content.auth.signin}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground relative z-10">
          {content.auth.no_account}{" "}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            {content.auth.apply_here}
          </Link>
        </div>

        <div className="text-center mt-4 text-sm relative z-10">
          <Link
            to="/"
            className="text-primary font-bold hover:underline transition-colors"
          >
            &larr; {content.auth.back_to_site}
          </Link>
        </div>
      </div>
    </div>
  );
}
