import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { Trash2, Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface DojoMember {
  id: string;
  name: string;
  rank: string;
  joinDate: string;
  imageUrl: string;
}

export default function MembersManager() {
  const [members, setMembers] = useState<DojoMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as DojoMember[];
      setMembers(data);
    } catch (err: any) {
      toast.error("Failed to load members: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setName("");
    setRank("");
    setJoinDate("");
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("A headshot/avatar is required!");
      return;
    }
    
    setSaving(true);
    const loadingToast = toast.loading("Uploading image and saving member...");

    try {
      const storageRef = ref(storage, `members/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "members"), {
        name,
        rank,
        joinDate,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      toast.success("Member added successfully!", { id: loadingToast });
      resetForm();
      fetchMembers();
    } catch (err: any) {
      toast.error("Error saving member: " + err.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName}?`)) return;

    try {
      await deleteDoc(doc(db, "members", id));
      toast.success("Member removed.");
      fetchMembers();
    } catch (err: any) {
      toast.error("Failed to delete member: " + err.message);
    }
  };

  return (
    <div className="w-full h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">Members Directory</h1>
          <p className="text-muted-foreground">Manage dojo students and instructors.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
             <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
             No members found. Click "Add Member" to add a student.
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="bg-card border rounded-3xl p-6 flex items-center gap-5 shadow-sm group">
              <div className="w-20 h-20 bg-secondary/20 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-md">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon size={24}/></div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-heading font-bold text-xl">{member.name}</h3>
                <p className="text-sm text-primary font-bold uppercase tracking-wider">{member.rank}</p>
                <p className="text-xs text-muted-foreground mt-1">Joined: {member.joinDate}</p>
              </div>
              
              <button 
                onClick={() => handleDelete(member.id, member.name)}
                className="opacity-0 group-hover:opacity-100 text-destructive bg-destructive/10 hover:bg-destructive/20 p-2.5 rounded-xl transition-all"
                title="Remove Member"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ADD MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b bg-secondary/10">
              <h2 className="text-2xl font-heading font-bold">Add New Member</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
               <div>
                  <label className="block text-sm font-bold mb-1">Full Name</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
               </div>

               <div>
                  <label className="block text-sm font-bold mb-1">Rank / Belt</label>
                  <input required type="text" value={rank} onChange={e => setRank(e.target.value)} placeholder="e.g. Black Belt 1st Dan" className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
               </div>

               <div>
                  <label className="block text-sm font-bold mb-1">Join Date</label>
                  <input required type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" />
               </div>

               <div>
                  <label className="block text-sm font-bold mb-1">Member Headshot</label>
                  <input required type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border border-dashed rounded-xl px-4 py-3 bg-secondary/20 cursor-pointer" />
               </div>

               <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={resetForm} className="px-6 py-2 rounded-xl font-bold bg-secondary hover:bg-secondary/80">Cancel</button>
                  <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                    {saving ? "Saving..." : "Add Member"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
