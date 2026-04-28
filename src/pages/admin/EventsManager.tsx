import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { Trash2, Plus, X, Image as ImageIcon, Loader2, Edit } from "lucide-react";
import { optimizeImage } from "@/lib/imageOptimization";

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
  createdAt?: string;
  updatedAt?: string;
}

export default function EventsManager() {
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load events: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setEventType("Competition");
    setDate("");
    setTime("");
    setLocation("");
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleEdit = (evt: DojoEvent) => {
    setEditingId(evt.id);
    setTitle(evt.title);
    setDescription(evt.description);
    setEventType(evt.eventType);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setImageFile(null); // Wait for a new file, otherwise keep old
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error("An event image is required for new events!");
      return;
    }
    
    setSaving(true);
    const loadingToast = toast.loading(editingId ? "Updating event..." : "Uploading image and saving event...");

    try {
      let finalImageUrl: string | undefined;

      // 1. Upload new image if selected
      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(storage, `events/${Date.now()}_${imageFile.name.split('.')[0]}.webp`);
        
        const metadata = {
          contentType: 'image/webp',
          cacheControl: 'public,max-age=31536000',
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      // 2. Save document to firestore
      if (editingId) {
        const updateData: Partial<DojoEvent> = {
          title,
          description,
          eventType,
          date,
          time,
          location,
          updatedAt: new Date().toISOString()
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateDoc(doc(db, "events", editingId), updateData);
        toast.success("Event updated successfully!", { id: loadingToast });
      } else {
        await addDoc(collection(db, "events"), {
          title,
          description,
          eventType,
          date,
          time,
          location,
          imageUrl: finalImageUrl,
          createdAt: new Date().toISOString()
        });
        toast.success("Event created successfully!", { id: loadingToast });
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Error saving event: " + errorMessage, { id: loadingToast });
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to delete event: " + errorMessage);
    }
  };

  return (
    <div className="w-full min-h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">Events Management</h1>
          <p className="text-muted-foreground">Create, edit, and organize dojo events.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 justify-items-center auto-rows-fr">
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
            <div key={evt.id} className="bg-card border rounded-3xl p-6 flex flex-col gap-6 shadow-sm overflow-hidden w-full max-w-md h-full transition-all hover:shadow-md border-border/60">
              <div className="w-full h-48 bg-secondary/20 rounded-2xl overflow-hidden flex-shrink-0 border border-border/40">
                {evt.imageUrl ? (
                  <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon size={32}/></div>
                )}
              </div>
              <div className="flex-grow flex flex-col min-w-0">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <h3 className="font-heading font-black text-xl line-clamp-1 break-words leading-tight">{evt.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg border border-primary/20 flex-shrink-0">
                    {evt.eventType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-4 break-words leading-relaxed">{evt.description}</p>
                
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

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
              <h2 className="text-2xl font-heading font-bold">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex flex-col gap-5">
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
                  <label className="block text-sm font-bold mb-1">
                    Cover Image {editingId && <span className="text-muted-foreground font-normal">(Leave empty to keep current image)</span>}
                  </label>
                  <input required={!editingId} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer" />
               </div>

               <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={resetForm} className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    {saving ? "Saving..." : (editingId ? "Update Event" : "Save Event")}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
