import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PresidentData } from "@/types";
import { translateText } from "@/api/translate";
import { optimizeImage } from "@/lib/imageOptimization";

export function usePresidentEditor() {
  const { content, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [belt, setBelt] = useState("");
  const [bio, setBio] = useState("");

  // Image handling
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const aboutDoc = await getDoc(doc(db, "settings", "president"));
      if (aboutDoc.exists()) {
        const data = aboutDoc.data() as PresidentData;
        setName(data.name || "");
        const langMap = data[language];
        setBelt(langMap?.belt || "");
        setBio(langMap?.bio || "");
        setCurrentImageUrl(data.imageUrl || "");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load President data: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading(content.admin.about.toast_saving);

    try {
      let finalImageUrl = currentImageUrl;

      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(storage, `settings/president_avatar_${Date.now()}`);

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
        setCurrentImageUrl(finalImageUrl);
      }

      const oppositeLang = language === "en" ? "es" : "en";
      let translatedBio = "";
      let translatedBelt = "";

      const docSnap = await getDoc(doc(db, "settings", "president"));
      const existingData = docSnap.exists() ? (docSnap.data() as PresidentData) : null;

      if (existingData) {
        if (bio !== existingData[language]?.bio) {
          translatedBio = await translateText(bio, oppositeLang);
        } else {
          translatedBio = existingData[oppositeLang]?.bio || "";
        }

        if (belt !== existingData[language]?.belt) {
          translatedBelt = await translateText(belt, oppositeLang);
        } else {
          translatedBelt = existingData[oppositeLang]?.belt || "";
        }
      } else {
        translatedBio = await translateText(bio, oppositeLang);
        translatedBelt = await translateText(belt, oppositeLang);
      }

      const presEnRole = "President";
      const presEsRole = "Presidente";

      const saveData: PresidentData = {
        name,
        en: language === "en"
          ? { role: presEnRole, bio, belt }
          : { role: presEnRole, bio: translatedBio, belt: translatedBelt },
        es: language === "es"
          ? { role: presEsRole, bio, belt }
          : { role: presEsRole, bio: translatedBio, belt: translatedBelt },
        sourceLang: language,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "settings", "president"), saveData, { merge: true });

      toast.success(content.admin.about.toast_success, { id: loadingToast });
      setImageFile(null);
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

  return {
    loading,
    saving,
    name,
    setName,
    belt,
    setBelt,
    bio,
    setBio,
    currentImageUrl,
    setCurrentImageUrl,
    imageFile,
    setImageFile,
    handleSave,
  };
}
