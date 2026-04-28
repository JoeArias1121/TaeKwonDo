import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { LayoutDashboard, CalendarDays, Users, FileText, ShieldCheck, LogOut, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminLayout() {
  const { appUser, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-card border-r flex flex-col items-stretch flex-shrink-0 transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-20 hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`h-20 flex items-center ${isCollapsed ? "justify-center" : "px-6"} border-b`}>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-xl shadow-sm">D</div>
          ) : (
            <div className="font-heading font-black text-2xl text-primary tracking-tight">Dojo CMS</div>
          )}
        </div>
        
        <div className={`flex-grow py-6 ${isCollapsed ? "px-2" : "px-4"} flex flex-col gap-2 overflow-y-auto`}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`
              }
              title={isCollapsed ? item.name : ""}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}

          <div className="mt-auto">
            <Link 
              to="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-4"} py-3 rounded-xl font-semibold text-primary hover:bg-primary/10 transition-all`}
              title={isCollapsed ? "Home Page" : ""}
            >
              <div className="flex-shrink-0"><ExternalLink size={20} /></div>
              {!isCollapsed && <span className="truncate">Home Page</span>}
            </Link>
          </div>
        </div>

        <div className={`p-4 border-t mt-auto ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {!isCollapsed ? (
            <div className="bg-secondary/20 p-4 rounded-xl mb-4 overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">{appUser?.email}</p>
              <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{appUser?.role}</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
              {appUser?.email?.[0].toUpperCase()}
            </div>
          )}
          <button 
            onClick={logout}
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2 px-4"} w-full py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all font-semibold`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <div className="flex-shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto">
        <div className="p-10 pb-20 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
