import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Check, X, ShieldAlert, Loader2 } from "lucide-react";
import { AppUser } from "@/auth/AuthContext";

export default function Approvals() {
  const [pendingUsers, setPendingUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), where("isApproved", "==", false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ ...d.data() })) as AppUser[];
      setPendingUsers(data);
    } catch (err: any) {
      toast.error("Failed to load pending users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (uid: string, email: string | null) => {
    try {
      await updateDoc(doc(db, "users", uid), { isApproved: true });
      toast.success(`${email} has been approved and granted access.`);
      fetchPending();
    } catch (err: any) {
      toast.error("Error approving user: " + err.message);
    }
  };

  const handleReject = async (uid: string) => {
    if (!window.confirm("Are you sure you want to reject this request? This will delete their database presence.")) return;

    try {
      await deleteDoc(doc(db, "users", uid));
      toast.success("Request rejected.");
      fetchPending();
    } catch (err: any) {
      toast.error("Error rejecting user: " + err.message);
    }
  };

  return (
    <div className="w-full h-full font-sans max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black">Access Approvals</h1>
        <p className="text-muted-foreground">Approve or deny dashboard access for new signups.</p>
      </div>

      <div className="bg-card border rounded-3xl p-6 shadow-sm">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : pendingUsers.length === 0 ? (
           <div className="text-center py-12 flex flex-col items-center">
             <ShieldAlert size={48} className="text-muted-foreground/30 mb-4" />
             <h3 className="text-xl font-bold font-heading mb-1">No pending requests</h3>
             <p className="text-muted-foreground">You're all caught up! There are no new signups waiting for approval.</p>
           </div>
        ) : (
           <div className="flex flex-col gap-4">
             {pendingUsers.map(user => (
               <div key={user.uid} className="flex justify-between items-center bg-secondary/10 border p-4 rounded-xl">
                 <div>
                   <p className="font-bold text-lg">{user.email}</p>
                   <p className="text-sm text-primary uppercase tracking-wider font-bold">Requested Role: {user.role}</p>
                 </div>
                 <div className="flex gap-3">
                   <button 
                     onClick={() => handleReject(user.uid)}
                     className="p-2 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors"
                     title="Reject & Delete"
                   >
                     <X size={20} />
                   </button>
                   <button 
                     onClick={() => handleApprove(user.uid, user.email)}
                     className="px-6 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-lg flex items-center gap-2 transition-transform active:scale-95"
                   >
                     <Check size={20} /> Approve
                   </button>
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
