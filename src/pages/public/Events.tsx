import placeHolderImage from "@/assets/placeHolderImage.png";
import Event, { EventType } from "@/components/Event";

export default function Events() {
  const upcomingEvents = [];
  const eventTypes: EventType[] = ['Competition', 'Fundraising', 'Ceremony'];
  
  for (let i = 0; i < 3; i++) {
    upcomingEvents.push(
      <Event
        key={`upcoming-${i}`}
        title={`Upcoming Event ${i + 1}`}
        description="Join us for a rigorous day of Taekwon-Do testing, forms, and sparring. All belt levels are encouraged to participate and spectate."
        imageUrl={placeHolderImage}
        eventType={eventTypes[i % 3]}
      />,
    );
  }

  const previousEvents = [];
  for (let i = 0; i < 3; i++) {
    previousEvents.push(
      <Event
        key={`past-${i}`}
        title={`Past Event ${i + 1}`}
        description="A look back at our incredible regional tournament where our students brought home over 20 medals across all divisions."
        imageUrl={placeHolderImage}
        eventType={eventTypes[i % 3]}
      />,
    );
  }

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
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-heading font-bold">Upcoming Events</h2>
            <div className="h-px flex-grow bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingEvents}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-heading font-bold">Past Events</h2>
            <div className="h-px flex-grow bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {previousEvents}
          </div>
        </div>
      </div>
    </div>
  );
}
