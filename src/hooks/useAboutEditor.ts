import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AboutMeData } from "@/types";
import { translateText } from "@/api/translate";
import { optimizeImage } from "@/lib/imageOptimization";

export function useAboutEditor() {
  const { content, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
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
        const langMap = data[language];
        setTitle(langMap?.title || "");
        setRole(langMap?.role || "");
        setBio(langMap?.bio || "");
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
        const storageRef = ref(storage, `settings/about_avatar_${Date.now()}`);

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
        setCurrentImageUrl(finalImageUrl);
      }

      const oppositeLang = language === "en" ? "es" : "en";
      let translatedTitle = "";
      let translatedRole = "";
      let translatedBio = "";

      const docSnap = await getDoc(doc(db, "settings", "aboutMe"));
      const existingData = docSnap.exists() ? (docSnap.data() as AboutMeData) : null;

      if (existingData) {
        if (title !== existingData[language]?.title) {
          translatedTitle = await translateText(title, oppositeLang);
        } else {
          translatedTitle = existingData[oppositeLang]?.title || "";
        }

        if (role !== existingData[language]?.role) {
          translatedRole = await translateText(role, oppositeLang);
        } else {
          translatedRole = existingData[oppositeLang]?.role || "";
        }

        if (bio !== existingData[language]?.bio) {
          translatedBio = await translateText(bio, oppositeLang);
        } else {
          translatedBio = existingData[oppositeLang]?.bio || "";
        }
      } else {
        translatedTitle = await translateText(title, oppositeLang);
        translatedRole = await translateText(role, oppositeLang);
        translatedBio = await translateText(bio, oppositeLang);
      }

      const saveData: AboutMeData = {
        en: language === "en"
          ? { title, role, bio }
          : { title: translatedTitle, role: translatedRole, bio: translatedBio },
        es: language === "es"
          ? { title, role, bio }
          : { title: translatedTitle, role: translatedRole, bio: translatedBio },
        sourceLang: language,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "settings", "aboutMe"), saveData, { merge: true });

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
    title,
    setTitle,
    role,
    setRole,
    bio,
    setBio,
    currentImageUrl,
    setCurrentImageUrl,
    imageFile,
    setImageFile,
    handleSave,
  };
}
