import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 px-6">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get In Touch</h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          We welcome new students of all ages and experience levels. Visit us, or reach out to start your Taekwon-Do journey today.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-card border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/50 rounded-tr-[120px] pointer-events-none"/>

        <div className="flex flex-col gap-8 relative z-10">
          
          <div className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <MapPin className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold mb-1">Dojo Location</h2>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=238+Fort+Washington+Ave.+Bsmt.+New+York+NY+10032"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline font-medium hover:text-primary/80 transition-colors"
              >
                238 Fort Washington Ave. Bsmt.<br/>
                New York, NY 10032
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Phone className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold mb-1">Phone Number</h2>
              <a href="tel:+16467175634" className="text-muted-foreground text-lg hover:text-primary transition-colors">
                1-646-717-5634
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Mail className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold mb-1">Email Address</h2>
              <a href="mailto:ramon16itf@yahoo.com" className="text-muted-foreground text-lg hover:text-primary transition-colors">
                ramon16itf@yahoo.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
