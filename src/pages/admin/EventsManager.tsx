import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { Trash2, Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";

export type EventType = "Competition" | "Fundraising" | "Ceremony";

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

export default function EventsManager() {
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("Competition");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as DojoEvent[];
      setEvents(data);
    } catch (err: any) {
      toast.error("Failed to load events: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("Competition");
    setDate("");
    setTime("");
    setLocation("");
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("An event image is required!");
      return;
    }
    
    setSaving(true);
    const loadingToast = toast.loading("Uploading image and saving event...");

    try {
      // 1. Upload image
      const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Save document to firestore
      await addDoc(collection(db, "events"), {
        title,
        description,
        eventType,
        date,
        time,
        location,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      toast.success("Event created successfully!", { id: loadingToast });
      resetForm();
      fetchEvents();
    } catch (err: any) {
      toast.error("Error saving event: " + err.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "events", id));
      toast.success("Event deleted.");
      fetchEvents();
    } catch (err: any) {
      toast.error("Failed to delete event: " + err.message);
    }
  };

  return (
    <div className="w-full h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">Events Management</h1>
          <p className="text-muted-foreground">Create, edit, and organize dojo events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
             <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
             No events found in the database. Click "New Event" to create one.
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="bg-card border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
              <div className="w-full sm:w-40 h-40 bg-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
                {evt.imageUrl ? (
                  <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon size={32}/></div>
                )}
              </div>
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-xl line-clamp-1">{evt.title}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">
                    {evt.eventType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{evt.description}</p>
                
                <div className="text-xs font-medium text-foreground/70 bg-secondary/30 rounded-lg p-3 grid grid-cols-2 gap-2 mb-4">
                  <div className="truncate">📅 {evt.date}</div>
                  <div className="truncate">⏰ {evt.time}</div>
                  <div className="col-span-2 truncate">📍 {evt.location}</div>
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                   <button 
                      onClick={() => handleDelete(evt.id)}
                      className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-lg transition-colors"
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

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
              <h2 className="text-2xl font-heading font-bold">Create New Event</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex flex-col gap-5">
               <div>
                  <label className="block text-sm font-bold mb-1">Event Title</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
               </div>

               <div>
                  <label className="block text-sm font-bold mb-1">Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Event Type</label>
                    <select value={eventType} onChange={e => setEventType(e.target.value as EventType)} className="w-full border rounded-xl px-4 py-2.5 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none">
                      <option value="Competition">Competition</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Ceremony">Ceremony</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Location</label>
                    <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Central Park Dojo" className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Date</label>
                    <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Time</label>
                    <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold mb-1">Cover Image</label>
                  <input required type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer" />
               </div>

               <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={resetForm} className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    {saving ? "Creating..." : "Save Event"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
