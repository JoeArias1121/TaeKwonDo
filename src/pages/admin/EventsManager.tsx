import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Loader2,
  Edit,
} from "lucide-react";
import { optimizeImage } from "@/lib/imageOptimization";
import { useLanguage } from "@/contexts/LanguageContext";

export type EventType =
  | "Competition"
  | "Fundraising"
  | "Ceremony"
  | "Seminar"
  | "Competición"
  | "Donación"
  | "Ceremonia"
  | "Seminario";

interface EventLangMap {
  title?: string;
  description?: string;
}

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
  en?: EventLangMap;
  es?: EventLangMap;
  sourceLang?: string;
}

export default function EventsManager() {
  const { content, language } = useLanguage();
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>(
    language === "en" ? "Competition" : "Competición",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "events"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as DojoEvent[];
      setEvents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
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
    // Read from the active language parent map, fallback to flat fields for legacy docs
    const langMap = evt[language];
    setTitle(langMap?.title ?? evt.title);
    setDescription(langMap?.description ?? evt.description);
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
      toast.error(content.admin.events.toast_image_req);
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingId
        ? content.admin.events.toast_updating
        : content.admin.events.toast_saving,
    );

    try {
      let finalImageUrl: string | undefined;

      // 1. Upload new image if selected
      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(
          storage,
          `events/${Date.now()}_${imageFile.name.split(".")[0]}.webp`,
        );

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      // 2. Save document to firestore
      if (editingId) {
        const updateData: Partial<DojoEvent> = {
          // Save title and description inside the active language parent map
          [language]: { title, description },
          sourceLang: language,
          eventType,
          date,
          time,
          location,
          updatedAt: new Date().toISOString(),
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateDoc(doc(db, "events", editingId), updateData);
        toast.success(content.admin.events.toast_success_update, {
          id: loadingToast,
        });
      } else {
        await addDoc(collection(db, "events"), {
          // Save title and description inside the active language parent map
          [language]: { title, description },
          sourceLang: language,
          eventType,
          date,
          time,
          location,
          imageUrl: finalImageUrl,
          createdAt: new Date().toISOString(),
        });
        toast.success(content.admin.events.toast_success_create, {
          id: loadingToast,
        });
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.events.toast_error_save + errorMessage, {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(content.admin.events.confirm_delete)) return;

    try {
      await deleteDoc(doc(db, "events", id));
      toast.success(content.admin.events.toast_deleted);
      fetchEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.events.toast_error_delete + errorMessage);
    }
  };

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
                    alt={evt.title}
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
                    {evt.title}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg border border-primary/20 flex-shrink-0">
                    {evt.eventType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-4 break-words leading-relaxed">
                  {evt.description}
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

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
              <h2 className="text-2xl font-heading font-bold">
                {editingId
                  ? content.admin.events.edit_event
                  : content.admin.events.create_event}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 overflow-y-auto flex flex-col gap-5"
            >
              <div>
                <label className="block text-sm font-bold mb-1">
                  {content.admin.events.form_title}
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  {content.admin.events.form_description}
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {content.admin.events.form_type}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full border rounded-xl px-4 py-2.5 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    {content.events.options.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {content.admin.events.form_location}
                  </label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Central Park Dojo"
                    className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {content.admin.events.form_date}
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {content.admin.events.form_time}
                  </label>
                  <input
                    required
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  {content.admin.events.form_cover}{" "}
                  {editingId && (
                    <span className="text-muted-foreground font-normal">
                      {content.admin.events.form_cover_hint}
                    </span>
                  )}
                </label>
                <input
                  required={!editingId}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80"
                >
                  {content.admin.events.btn_cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving
                    ? content.admin.events.btn_saving
                    : editingId
                      ? content.admin.events.btn_update
                      : content.admin.events.btn_save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
