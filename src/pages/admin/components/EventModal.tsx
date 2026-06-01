import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { EventType } from "@/types";

interface EventModalProps {
  isOpen: boolean;
  editingId: string | null;
  onClose: () => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  eventType: EventType;
  setEventType: (value: EventType) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function EventModal({
  isOpen,
  editingId,
  onClose,
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
  onSave,
  saving,
}: EventModalProps) {
  const { content } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
          <h2 className="text-2xl font-heading font-bold">
            {editingId
              ? content.admin.events.edit_event
              : content.admin.events.create_event}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 overflow-y-auto flex flex-col gap-5">
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
            <span className="block text-sm font-bold mb-1">
              {content.admin.events.form_cover}{" "}
              {editingId && (
                <span className="text-muted-foreground font-normal">
                  {content.admin.events.form_cover_hint}
                </span>
              )}
            </span>
            <label className="w-full flex items-center justify-between border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all border-border/80">
              <span className="text-sm text-muted-foreground truncate mr-2">
                {imageFile ? imageFile.name : content.admin.events.form_cover_select}
              </span>
              <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold flex-shrink-0">
                {content.admin.events.form_cover_browse}
              </span>
              <input
                required={!editingId}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}
