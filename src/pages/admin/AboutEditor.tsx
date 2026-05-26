import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { optimizeImage } from "@/lib/imageOptimization";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutLangMap {
  title?: string;
  role?: string;
  bio?: string;
}

interface AboutMeData {
  title?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  sourceLang?: string;
  updatedAt?: string;
  en?: AboutLangMap;
  es?: AboutLangMap;
}

export default function AboutEditor() {
  const { content, language } = useLanguage();
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
        const data = aboutDoc.data() as AboutMeData;
        // Read from the active language parent map, fallback to flat fields for legacy docs
        const langMap = data[language];
        setTitle(langMap?.title ?? data.title ?? "Grand Master Ramon");
        setRole(langMap?.role ?? data.role ?? "Lead Instructor");
        setBio(langMap?.bio ?? data.bio ?? "");
        setCurrentImageUrl(data.imageUrl || "");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load about data: " + errorMessage);
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
    const loadingToast = toast.loading(content.admin.about.toast_saving);

    try {
      let finalImageUrl = currentImageUrl;

      // If a new image was selected, upload it
      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(storage, `settings/about_avatar_${Date.now()}`);

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
        setCurrentImageUrl(finalImageUrl);
      }

      // Save to 'settings/aboutMe' singleton document
      const saveData: AboutMeData = {
        // Save title/role/bio inside the active language parent map
        [language]: { title, role, bio },
        sourceLang: language,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, "settings", "aboutMe"),
        saveData,
        { merge: true },
      );

      toast.success(content.admin.about.toast_success, { id: loadingToast });
      setImageFile(null); // Reset file input implicitly
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.about.toast_error + errorMessage, {
        id: loadingToast,
      });
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
    <div className="w-full min-h-full font-sans max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-black">
          {content.admin.about.title}
        </h1>
        <p className="text-muted-foreground">{content.admin.about.subtitle}</p>
      </div>

      <div className="bg-card border rounded-3xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Image Preview Area */}
            <div className="flex flex-col gap-3 w-full sm:w-1/3">
              <label className="text-sm font-bold">
                {content.admin.about.profile_avatar}
              </label>
              <div className="w-full aspect-square bg-secondary/20 rounded-2xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center relative">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt="Current Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {content.admin.about.no_image}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-sm border border-dashed rounded-lg p-2 bg-secondary/10 cursor-pointer"
              />
            </div>

            {/* Text Fields */}
            <div className="flex flex-col gap-5 w-full sm:w-2/3">
              <div>
                <label className="block text-sm font-bold mb-1">
                  {content.admin.about.display_title}
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
                  {content.admin.about.display_role}
                </label>
                <input
                  required
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-bold mb-1">
                  {content.admin.about.bio}
                </label>
                <textarea
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving
                ? content.admin.about.btn_saving
                : content.admin.about.btn_save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
