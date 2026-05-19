import { useAuth } from "@/auth/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { appUser } = useAuth();
  const { content } = useLanguage();
  return (
    <div className="w-full h-full font-sans">
      <div className="bg-card rounded-3xl shadow-sm border p-10 flex flex-col gap-4">
        <h1 className="text-4xl font-heading font-black mb-2">{content.admin.dashboard.welcome}</h1>
        <p className="text-muted-foreground text-lg mb-6">
          {content.admin.dashboard.subtitle}
        </p>
        
        {appUser?.role === 'superadmin' && (
           <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl flex flex-col items-start gap-2">
             <h2 className="font-bold text-primary text-xl">{content.admin.dashboard.superadmin_title}</h2>
             <p className="text-secondary-foreground">{content.admin.dashboard.superadmin_subtitle}</p>
           </div>
        )}
      </div>
    </div>
  )
}
