import { useAuth } from "@/auth/AuthContext";

export default function Dashboard() {
  const { appUser } = useAuth();
  return (
    <div className="w-full h-full font-sans">
      <div className="bg-card rounded-3xl shadow-sm border p-10 flex flex-col gap-4">
        <h1 className="text-4xl font-heading font-black mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground text-lg mb-6">
          This is your central control panel. Use the sidebar to manage your events, members, and public information.
        </p>
        
        {appUser?.role === 'superadmin' && (
           <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex flex-col items-start gap-2">
             <h2 className="font-bold text-primary text-xl">Super Admin Access Active</h2>
             <p className="text-secondary-foreground">You have access to pending user approvals. Head over to the Approvals tab to manage incoming signup requests.</p>
           </div>
        )}
      </div>
    </div>
  )
}
