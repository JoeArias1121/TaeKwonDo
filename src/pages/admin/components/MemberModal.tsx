import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MemberModalProps {
  isOpen: boolean;
  editingId: string | null;
  onClose: () => void;
  name: string;
  setName: (value: string) => void;
  rank: string;
  setRank: (value: string) => void;
  joinDate: string;
  setJoinDate: (value: string) => void;
  imageFile: File | null;
  setImageFile: (value: File | null) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function MemberModal({
  isOpen,
  editingId,
  onClose,
  name,
  setName,
  rank,
  setRank,
  joinDate,
  setJoinDate,
  imageFile,
  setImageFile,
  onSave,
  saving,
}: MemberModalProps) {
  const { content } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
          <h2 className="text-2xl font-heading font-bold">
            {editingId
              ? content.admin.members.edit_member
              : content.admin.members.create_member}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.members.form_name}
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.members.form_rank}
            </label>
            <input
              required
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. Black Belt 1st Dan"
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {content.admin.members.form_date}
            </label>
            <input
              required
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div>
            <span className="block text-sm font-bold mb-1">
              {content.admin.members.form_headshot}{" "}
              {editingId && (
                <span className="text-muted-foreground font-normal">
                  {content.admin.members.form_headshot_hint}
                </span>
              )}
            </span>
            <label className="w-full flex items-center justify-between border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all border-border/80">
              <span className="text-sm text-muted-foreground truncate mr-2">
                {imageFile ? imageFile.name : content.admin.members.form_headshot_select}
              </span>
              <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold flex-shrink-0">
                {content.admin.members.form_headshot_browse}
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
              {content.admin.members.btn_cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving
                ? content.admin.members.btn_saving
                : editingId
                  ? content.admin.members.btn_update
                  : content.admin.members.btn_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
