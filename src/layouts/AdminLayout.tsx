import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { LayoutDashboard, CalendarDays, Users, FileText, ShieldCheck, LogOut } from "lucide-react";

export default function AdminLayout() {
  const { appUser, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} />, exact: true },
    { name: "Events", path: "/admin/events", icon: <CalendarDays size={20} /> },
    { name: "Members", path: "/admin/members", icon: <Users size={20} /> },
    { name: "About Me", path: "/admin/about", icon: <FileText size={20} /> },
  ];

  // Superadmin gets the extra approval tab
  if (appUser?.role === "superadmin") {
    navItems.push({ name: "Approvals", path: "/admin/approvals", icon: <ShieldCheck size={20} /> });
  }

  return (
    <div className="flex h-screen bg-secondary/10 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col items-stretch flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b">
          <div className="font-heading font-black text-2xl text-primary tracking-tight">Dojo CMS</div>
        </div>
        
        <div className="flex-grow py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="bg-secondary/20 p-4 rounded-xl mb-4">
            <p className="text-sm font-bold text-foreground truncate">{appUser?.email}</p>
            <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{appUser?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-semibold"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
}
