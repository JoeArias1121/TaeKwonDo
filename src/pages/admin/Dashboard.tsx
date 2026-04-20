import { useAuth } from "@/auth/AuthContext";

export default function Dashboard() {
  const { appUser, logout } = useAuth();
  return (
    <div className="min-h-screen bg-secondary/10 p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border p-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Welcome back. Your role is: <span className="font-bold text-primary uppercase">{appUser?.role}</span></p>
        
        {appUser?.role === 'superadmin' && (
           <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-6">
             <h2 className="font-bold text-primary">Super Admin Controls</h2>
             <p className="text-sm text-foreground">You have access to pending user approvals.</p>
           </div>
        )}

        <button onClick={logout} className="bg-secondary text-secondary-foreground font-semibold px-6 py-2 rounded-lg hover:bg-secondary/80 transition-colors">
            Sign Out
        </button>
      </div>
    </div>
  )
}
