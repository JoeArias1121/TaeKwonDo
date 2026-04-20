import { Link } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function PendingApproval() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full mx-auto flex items-center justify-center font-heading font-black text-2xl mb-6">
          !
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">Pending Approval</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Your account has been successfully created. However, you must wait for a Super Admin to manually approve your access before you can enter the dashboard.
        </p>
        
        <div className="flex flex-col gap-3">
            <Link 
                to="/" 
                className="w-full border border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-all block"
            >
                Return to Site
            </Link>
            <button 
                onClick={logout}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-4"
            >
                Sign out of pending account
            </button>
        </div>
      </div>
    </div>
  );
}
