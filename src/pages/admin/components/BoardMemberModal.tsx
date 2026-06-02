import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BoardMemberModalProps {
  isOpen: boolean;
  editingId: string | null;
  onClose: () => void;
  title: string;
  setTitle: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  belt: string;
  setBelt: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  order: number;
  setOrder: (value: number) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function BoardMemberModal({
  isOpen,
  editingId,
  onClose,
  title,
  setTitle,
  role,
  setRole,
  belt,
  setBelt,
  bio,
  setBio,
  order,
  setOrder,
  imageFile,
  setImageFile,
  onSave,
  saving,
}: BoardMemberModalProps) {
  const { content } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b bg-secondary/10 flex-shrink-0">
          <h2 className="text-2xl font-heading font-bold">
            {editingId
              ? content.admin.board.edit_member
              : content.admin.board.create_member}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.board.form_name}
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
              {content.admin.board.form_position}
            </label>
            <input
              required
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={content.admin.board.form_position_placeholder}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.board.form_order}
            </label>
            <input
              required
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.board.form_belt}
            </label>
            <input
              required
              type="text"
              value={belt}
              onChange={(e) => setBelt(e.target.value)}
              placeholder={content.admin.board.form_belt_placeholder}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.board.form_bio}
            </label>
            <textarea
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            />
          </div>

          <div>
            <span className="block text-sm font-bold mb-1">
              {content.admin.board.form_avatar}{" "}
              {editingId && (
                <span className="text-muted-foreground font-normal">
                  {content.admin.board.form_avatar_hint}
                </span>
              )}
            </span>
            <label className="w-full flex items-center justify-between border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all border-border/80">
              <span className="text-sm text-muted-foreground truncate mr-2">
                {imageFile ? imageFile.name : content.admin.about.form_avatar_select}
              </span>
              <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold flex-shrink-0">
                {content.admin.about.form_avatar_browse}
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

          <div className="flex justify-end gap-3 mt-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80"
            >
              {content.admin.board.btn_cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? content.admin.board.btn_saving : content.admin.board.btn_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
