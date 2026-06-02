import avatarFallback from "@/assets/avatar.jpg";
import staticData from "@/data/content.json";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PresidentData, BoardMember } from "@/types";

export default function ExecutiveBoard() {
  const { language } = useLanguage();

  // Load static President and Board Members baked during prebuild
  const presidentRaw = staticData.president as unknown as PresidentData | null;
  const boardMembersRaw = (staticData.boardMembers || []) as unknown as BoardMember[];

  // Helper to translate fields for President
  const getPresTranslated = (field: "role" | "bio" | "belt") => {
    if (!presidentRaw) return "";
    const langData = language === "es" ? presidentRaw.es : presidentRaw.en;
    return langData?.[field] || presidentRaw.en?.[field] || "";
  };

  // Helper to translate fields for Board Members
  const getMemberTranslated = (member: BoardMember, field: "role" | "bio" | "belt") => {
    const langData = language === "es" ? member.es : member.en;
    return langData?.[field] || member.en?.[field] || "";
  };

  const presData = presidentRaw
    ? {
        title: presidentRaw.name || "",
        role: getPresTranslated("role"),
        belt: getPresTranslated("belt"),
        bio: getPresTranslated("bio"),
        imageUrl: presidentRaw.imageUrl || avatarFallback,
      }
    : null;

  const boardList = boardMembersRaw.map((member) => ({
    id: member.id,
    title: member.name || "",
    role: getMemberTranslated(member, "role"),
    belt: getMemberTranslated(member, "belt"),
    bio: getMemberTranslated(member, "bio"),
    imageUrl: member.imageUrl || avatarFallback,
  }));

  return (
    <div className="w-full h-full flex flex-col items-center py-20 px-6 container mx-auto">
      {/* President Section */}
      {presData ? (
        <div className="flex flex-col items-center w-full max-w-3xl mb-16 animate-fadeIn">
          {/* Position shown above the card */}
          <div className="text-center w-full mb-4">
            <span className="text-primary font-bold uppercase tracking-widest text-lg md:text-xl">
              {presData.role}
            </span>
            {/* Blue line under that fades out to the edges of the card */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/80 to-transparent mt-2" />
          </div>

          {/* The Card */}
          <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-card p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-border/80 relative overflow-hidden min-h-[300px]">
            {/* Decorative background element */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110 group-hover:bg-primary/30 transition-colors duration-500" />
              <img
                src={presData.imageUrl}
                alt={presData.title}
                className="relative rounded-full w-40 h-40 md:w-48 md:h-48 object-cover border-4 border-background shadow-2xl z-10"
              />
            </div>

            <div className="flex flex-col text-center md:text-left z-10 flex-grow">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                {presData.title}
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full mb-4 mx-auto md:mx-0" />
              {presData.belt && (
                <div className="text-sm md:text-base font-bold text-primary mb-3 uppercase tracking-wide">
                  {presData.belt}
                </div>
              )}
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {presData.bio}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground mb-8">No Executive Board data found.</div>
      )}

      {/* Other Board Members Section */}
      {boardList.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-12 w-full max-w-5xl items-start">
            {boardList.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center w-full md:w-[calc(50%-24px)] max-w-lg animate-fadeIn"
              >
                {/* Position above the card */}
                <div className="text-center w-full mb-3">
                  <span className="text-primary font-bold uppercase tracking-widest text-sm md:text-base">
                    {member.role}
                  </span>
                  {/* Blue line under that fades out to the edges of the card */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent mt-1" />
                </div>

                {/* The Card */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-6 bg-card p-5 md:p-6 rounded-2xl shadow-lg shadow-black/5 border border-border/60 relative overflow-hidden min-h-[220px]">
                  {/* Decorative background element */}
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative flex-shrink-0 group">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg scale-110 group-hover:bg-primary/25 transition-colors duration-500" />
                    <img
                      src={member.imageUrl}
                      alt={member.title}
                      className="relative rounded-full w-28 h-28 md:w-32 md:h-32 object-cover border-2 border-background shadow-xl z-10"
                    />
                  </div>

                  <div className="flex flex-col text-center sm:text-left z-10 flex-grow">
                    <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-foreground">
                      {member.title}
                    </h2>
                    <div className="h-0.5 w-12 bg-primary rounded-full mb-3 mx-auto sm:mx-0" />
                    {member.belt && (
                      <div className="text-xs md:text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                        {member.belt}
                      </div>
                    )}
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
