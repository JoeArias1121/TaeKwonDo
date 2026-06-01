import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  Edit,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEventsManager } from "@/hooks/useEventsManager";
import { EventModal } from "./components/EventModal";

export default function EventsManager() {
  const { content, language } = useLanguage();
  const {
    events,
    loading,
    saving,
    isModalOpen,
    editingId,
    title,
    setTitle,
    description,
    setDescription,
    eventType,
    setEventType,
    date,
    setDate,
    time,
    setTime,
    location,
    setLocation,
    imageFile,
    setImageFile,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    setIsModalOpen,
  } = useEventsManager();

  return (
    <div className="w-full min-h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">
            {content.admin.events.title}
          </h1>
          <p className="text-muted-foreground">
            {content.admin.events.subtitle}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          {content.admin.events.new_event}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 justify-items-center auto-rows-fr">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
            {content.admin.events.no_events}
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="bg-card border rounded-3xl p-6 flex flex-col gap-6 shadow-sm overflow-hidden w-full max-w-md h-full transition-all hover:shadow-md border-border/60"
            >
              <div className="w-full h-48 bg-secondary/20 rounded-2xl overflow-hidden flex-shrink-0 border border-border/40">
                {evt.imageUrl ? (
                  <img
                    src={evt.imageUrl}
                    alt={evt[language]?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col min-w-0">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-heading font-black text-xl line-clamp-1 break-words leading-tight">
                    {evt[language]?.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg border border-primary/20 flex-shrink-0">
                    {evt[language]?.eventType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-4 break-words leading-relaxed">
                  {evt[language]?.description}
                </p>

                <div className="text-[11px] font-bold text-foreground/80 bg-secondary/30 rounded-xl p-3 flex flex-col gap-2 mb-4 border border-border/50">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-primary">📅</span> {evt.date}
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-primary">⏰</span> {evt.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 break-words pt-1 border-t border-border/20">
                    <span className="text-primary">📍</span> {evt.location}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border/50">
                  <button
                    onClick={() => handleEdit(evt)}
                    className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Edit Event"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
                    className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Delete Event"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        editingId={editingId}
        onClose={resetForm}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        eventType={eventType}
        setEventType={setEventType}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        location={location}
        setLocation={setLocation}
        imageFile={imageFile}
        setImageFile={setImageFile}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
