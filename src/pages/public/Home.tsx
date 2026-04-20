import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container relative mx-auto px-6 lg:px-12 py-20 lg:py-32 flex flex-col items-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 inline-block tracking-wide">
            NATIONAL AMERICAN TAEKWON-DO FEDERATION
          </span>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-foreground mb-6 leading-tight max-w-4xl tracking-tight">
            Master Your Mind, Body, <span className="text-primary">and Spirit.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Join a community dedicated to the authentic art of ITF Taekwon-Do. 
            Build discipline, strength, and character in a world-class environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/contact" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Start Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/aboutme" className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-all flex items-center justify-center">
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 w-full bg-secondary/30 flex-grow">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Mission Card */}
            <div className="bg-card p-8 md:p-12 rounded-3xl shadow-sm border hover:border-primary/30 transition-colors duration-300">
              <h2 className="text-3xl font-heading font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To preserve and teach the original, authentic techniques of Taekwon-Do as created by General Choi Hong Hi. 
                We strive to develop our students physically, mentally, and morally, creating leaders who contribute positively to society.
              </p>
            </div>

            {/* News Card */}
            <div className="bg-card p-8 md:p-12 rounded-3xl shadow-sm border relative overflow-hidden hover:border-primary/30 transition-colors duration-300">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"/>
              <h2 className="text-3xl font-heading font-bold mb-4">Latest News</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                Stay updated with our latest events, belt testings, and tournament results. Our community is constantly growing and celebrating new milestones.
              </p>
              <Link to="/events" className="group text-primary font-semibold hover:underline inline-flex items-center gap-2">
                View Upcoming Events <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
