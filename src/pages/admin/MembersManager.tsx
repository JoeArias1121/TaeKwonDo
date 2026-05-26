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

interface MemberLangMap {
  name?: string;
  rank?: string;
}

interface DojoMember {
  id: string;
  name: string;
  rank: string;
  joinDate: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  en?: MemberLangMap;
  es?: MemberLangMap;
  sourceLang?: string;
}

export default function MembersManager() {
  const { content, language } = useLanguage();
  const [members, setMembers] = useState<DojoMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "members"), orderBy("joinDate", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as DojoMember[];
      setMembers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load members: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRank("");
    setJoinDate("");
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleEdit = (member: DojoMember) => {
    setEditingId(member.id);
    // Read from the active language parent map, fallback to flat fields for legacy docs
    const langMap = member[language];
    setName(langMap?.name ?? member.name);
    setRank(langMap?.rank ?? member.rank);
    setJoinDate(member.joinDate);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error(content.admin.members.toast_image_req);
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingId
        ? content.admin.members.toast_updating
        : content.admin.members.toast_saving,
    );

    try {
      let finalImageUrl: string | undefined;

      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(
          storage,
          `members/${Date.now()}_${imageFile.name.split(".")[0]}.webp`,
        );

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      if (editingId) {
        const updateData: Partial<DojoMember> = {
          // Save name and rank inside the active language parent map
          [language]: { name, rank },
          sourceLang: language,
          joinDate,
          updatedAt: new Date().toISOString(),
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateDoc(doc(db, "members", editingId), updateData);
        toast.success(content.admin.members.toast_success_update, {
          id: loadingToast,
        });
      } else {
        await addDoc(collection(db, "members"), {
          // Save name and rank inside the active language parent map
          [language]: { name, rank },
          sourceLang: language,
          joinDate,
          imageUrl: finalImageUrl,
          createdAt: new Date().toISOString(),
        });
        toast.success(content.admin.members.toast_success_create, {
          id: loadingToast,
        });
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.members.toast_error_save + errorMessage, {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (
      !window.confirm(`${content.admin.members.confirm_delete}${memberName}?`)
    )
      return;

    try {
      await deleteDoc(doc(db, "members", id));
      toast.success(content.admin.members.toast_deleted);
      fetchMembers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.members.toast_error_delete + errorMessage);
    }
  };

  return (
    <div className="w-full min-h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">
            {content.admin.members.title}
          </h1>
          <p className="text-muted-foreground">
            {content.admin.members.subtitle}
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
          {content.admin.members.add_member}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center auto-rows-fr">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
            {content.admin.members.no_members}
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-card border rounded-3xl p-6 flex items-start gap-5 shadow-sm overflow-hidden w-full max-w-sm h-full border-border/60 transition-all hover:shadow-md"
            >
              <div className="w-20 h-20 bg-secondary/20 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-md">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col min-h-[5rem] min-w-0">
                <h3 className="font-heading font-bold text-xl break-words leading-tight">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-bold uppercase tracking-wider break-words">
                  {member.rank}
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  {content.admin.members.joined}
                  {member.joinDate}
                </p>

                <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border/50">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Edit Member"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Remove Member"
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
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
              <h2 className="text-2xl font-heading font-bold">
                {editingId
                  ? content.admin.members.edit_member
                  : content.admin.members.create_member}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
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
                  onClick={resetForm}
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
      )}
    </div>
  );
}
