import Event, { type EventType } from "@/components/Event";
import { CalendarX2 } from "lucide-react";
import staticData from "@/data/content.json";

interface DojoEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

export default function Events() {
  const events = (staticData.events || []) as DojoEvent[];
  
  // Sort events by date descending to match original query
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Split into upcoming and past based on current date
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = sortedEvents.filter(e => e.date >= today).reverse(); // closest first
  const pastEvents = sortedEvents.filter(e => e.date < today);

  return (
    <div className="w-full pb-20">
      <div className="bg-secondary/30 py-16 mb-12 border-b">
         <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Dojo Events</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay connected with our community through upcoming tournaments, belt testings, and seminars.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
          <>
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-heading font-bold">Upcoming Events</h2>
                <div className="h-px flex-grow bg-border" />
              </div>
              
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-secondary/10 rounded-3xl border border-dashed text-muted-foreground">
                  <CalendarX2 size={40} className="mb-3 opacity-50" />
                  <p>No upcoming events scheduled right now check back later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {upcomingEvents.map(evt => (
                     <Event 
                       key={evt.id}
                       title={evt.title}
                       description={evt.description}
                       imageUrl={evt.imageUrl}
                       eventType={evt.eventType}
                       date={evt.date}
                       time={evt.time}
                       location={evt.location}
                     />
                  ))}
                </div>
              )}
            </div>

            {pastEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-heading font-bold">Past Events</h2>
                  <div className="h-px flex-grow bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pastEvents.map(evt => (
                     <Event 
                       key={evt.id}
                       title={evt.title}
                       description={evt.description}
                       imageUrl={evt.imageUrl}
                       eventType={evt.eventType}
                       date={evt.date}
                       time={evt.time}
                       location={evt.location}
                     />
                  ))}
                </div>
              </div>
            )}
          </>
      </div>
    </div>
  );
}
