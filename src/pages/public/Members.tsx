import Member from '@/components/Member';
import staticData from "@/data/content.json";
import { useLanguage } from "@/contexts/LanguageContext";

interface DojoMember {
  id: string;
  name: string;
  name_es?: string;
  rank: string;
  rank_es?: string;
  imageUrl: string;
}

export default function Members() {
  const members = (staticData.members || []) as DojoMember[];
  const { language, content } = useLanguage();

  const getTranslated = (member: DojoMember, field: "name" | "rank") => {
    if (language === "es") {
      return member[`${field}_es`] || member[field];
    }
    return member[field];
  };

  return (
    <div className="w-full pb-20">
      <div className="bg-secondary/30 py-16 mb-12 border-b">
         <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{content.members.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.members.subtitle}
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {members.length === 0 ? (
           <div className="text-center text-muted-foreground p-12 bg-secondary/10 rounded-xl border border-dashed">
             {content.members.no_members}
           </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {members.map(member => (
               <Member 
                 key={member.id} 
                 name={getTranslated(member, "name")} 
                 avatarUrl={member.imageUrl} 
                 rank={getTranslated(member, "rank")}
               />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
