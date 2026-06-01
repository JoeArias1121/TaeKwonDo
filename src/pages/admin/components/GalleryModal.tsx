import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GalleryModalProps {
  isOpen: boolean;
  editingId: string | null;
  onClose: () => void;
  order: number;
  setOrder: (value: number) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
  currentImageUrl: string;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function GalleryModal({
  isOpen,
  editingId,
  onClose,
  order,
  setOrder,
  imageFile,
  setImageFile,
  currentImageUrl,
  onSave,
  saving,
}: GalleryModalProps) {
  const { content } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
          <h2 className="text-2xl font-heading font-bold">
            {editingId
              ? content.admin.gallery.edit_image
              : content.admin.gallery.create_image}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 flex flex-col gap-5">
          {/* Image Upload Input */}
          <div>
            <span className="block text-sm font-bold mb-1">
              {content.admin.gallery.form_image}{" "}
              {editingId && (
                <span className="text-muted-foreground font-normal">
                  {content.admin.gallery.form_image_hint}
                </span>
              )}
            </span>
            <label className="w-full flex items-center justify-between border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all border-border/80">
              <span className="text-sm text-muted-foreground truncate mr-2">
                {imageFile ? imageFile.name : content.admin.gallery.form_image_select}
              </span>
              <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold flex-shrink-0">
                {content.admin.gallery.form_image_browse}
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

          {/* Image Preview Area */}
          <div className="w-full h-40 bg-secondary/20 rounded-2xl overflow-hidden border border-border flex items-center justify-center relative">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt="Current Gallery Item"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-sm">
                No Image Selected
              </span>
            )}
          </div>

          {/* Display Order Selection */}
          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.gallery.form_order}
            </label>
            <select
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {content.admin.gallery.btn_cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {saving
                ? content.admin.gallery.btn_saving
                : editingId
                  ? content.admin.gallery.btn_update
                  : content.admin.gallery.btn_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
