import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function AboutEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("Grand Master Ramon");
  const [role, setRole] = useState("Lead Instructor");
  const [bio, setBio] = useState("");
  
  // Image handling
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const aboutDoc = await getDoc(doc(db, "settings", "aboutMe"));
      if (aboutDoc.exists()) {
        const data = aboutDoc.data();
        setTitle(data.title || "Grand Master Ramon");
        setRole(data.role || "Lead Instructor");
        setBio(data.bio || "");
        setCurrentImageUrl(data.imageUrl || "");
      }
    } catch (err: any) {
      toast.error("Failed to load about data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Saving About page data...");

    try {
      let finalImageUrl = currentImageUrl;

      // If a new image was selected, upload it
      if (imageFile) {
        const storageRef = ref(storage, `settings/about_avatar_${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
        setCurrentImageUrl(finalImageUrl);
      }

      // Save to 'settings/aboutMe' singleton document
      await setDoc(doc(db, "settings", "aboutMe"), {
        title,
        role,
        bio,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success("About page updated successfully!", { id: loadingToast });
      setImageFile(null); // Reset file input implicitly
    } catch (err: any) {
      toast.error("Error saving data: " + err.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full h-full font-sans max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black">Edit 'About Me'</h1>
        <p className="text-muted-foreground">Manage the content displayed on your public profile page.</p>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Image Preview Area */}
            <div className="flex flex-col gap-3 w-full sm:w-1/3">
              <label className="text-sm font-bold">Profile Avatar</label>
              <div className="w-full aspect-square bg-secondary/20 rounded-2xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center relative">
                 {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                 ) : currentImageUrl ? (
                    <img src={currentImageUrl} alt="Current Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-muted-foreground text-sm">No Image</span>
                 )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
                className="text-sm border border-dashed rounded-lg p-2 bg-secondary/10 cursor-pointer" 
              />
            </div>

            {/* Text Fields */}
            <div className="flex flex-col gap-5 w-full sm:w-2/3">
              <div>
                 <label className="block text-sm font-bold mb-1">Display Title</label>
                 <input 
                   required type="text" value={title} onChange={e => setTitle(e.target.value)} 
                   className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" 
                 />
              </div>

              <div>
                 <label className="block text-sm font-bold mb-1">Subtitle / Role</label>
                 <input 
                   required type="text" value={role} onChange={e => setRole(e.target.value)} 
                   className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none" 
                 />
              </div>

              <div className="flex-grow">
                 <label className="block text-sm font-bold mb-1">Biography / Introduction Text</label>
                 <textarea 
                   required value={bio} onChange={e => setBio(e.target.value)} 
                   rows={8}
                   className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none resize-none" 
                 />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t pt-6 mt-2">
             <button 
               type="submit" 
               disabled={saving} 
               className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
             >
               {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
               Save Changes
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
