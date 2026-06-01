import { useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import type { EventType } from "@/types";

export default function Event({
  title,
  description,
  imageUrl,
  eventType,
  date,
  time,
  location,
}: {
  title: string;
  description: string;
  imageUrl: string;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
}) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="group bg-card border flex flex-col w-full rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300">
      <div 
        onClick={() => setIsLightboxOpen(true)}
        className="relative h-56 w-full overflow-hidden cursor-pointer periodic-jiggle"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
            {eventType}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-heading font-bold mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-3 flex-grow line-clamp-3">
          {description}
        </p>

        <div className="flex flex-col gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Calendar size={16} className="text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock size={16} className="text-primary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors line-clamp-1"
              title={`View ${location} on Google Maps`}
            >
              {location}
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] cursor-zoom-out p-4"
        >
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
