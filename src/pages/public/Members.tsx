import Member from '@/components/Member';
import staticData from "@/data/content.json";

interface DojoMember {
  id: string;
  name: string;
  rank: string;
  imageUrl: string;
}

export default function Members() {
  const members = (staticData.members || []) as DojoMember[];

  return (
    <div className="w-full pb-20">
      <div className="bg-secondary/30 py-16 mb-12 border-b">
         <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Dojo Family</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated students and practitioners who make our Taekwon-Do community strong, supportive, and passionate.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {members.length === 0 ? (
           <div className="text-center text-muted-foreground p-12 bg-secondary/10 rounded-xl border border-dashed">
             No members have been listed yet.
           </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {members.map(member => (
               <Member 
                 key={member.id} 
                 name={member.name} 
                 avatarUrl={member.imageUrl} 
                 rank={member.rank}
               />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
