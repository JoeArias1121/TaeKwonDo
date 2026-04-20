import avatar from "@/assets/avatar.jpg";

export default function AboutMe() {
  return (
    <div className="w-full h-full flex flex-col items-center py-20 px-6 container mx-auto">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 bg-card p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex-shrink-0 group">
           <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110 group-hover:bg-primary/30 transition-colors duration-500" />
           <img
            src={avatar}
            alt="Grand Master Ramon"
            className="relative rounded-full w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-background shadow-2xl z-10"
          />
        </div>

        <div className="flex flex-col text-center md:text-left z-10">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Lead Instructor</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">
            Grand Master Ramon
          </h1>
          <div className="h-1 w-20 bg-primary rounded-full mb-6 mx-auto md:mx-0" />
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Welcome to our Dojo. I have dedicated my life to the practice and teaching of authentic ITF Taekwon-Do. 
            My goal is not only to teach self-defense but to build character, discipline, and respect in every student who walks through these doors.
            Whether you are a beginner taking your first steps or an advanced practitioner striving for mastery, 
            you will find a supportive and challenging environment here.
          </p>
        </div>
      </div>
    </div>
  );
}
