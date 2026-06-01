import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DojoMember } from "@/types";
import { getMembers, createMember, updateMember, deleteMember } from "@/api/members";
import { translateText } from "@/api/translate";
import { optimizeImage } from "@/lib/imageOptimization";

export function useMembersManager() {
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
      const data = await getMembers();
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
    const langMap = member[language];
    setName(langMap.name);
    setRank(langMap.rank);
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

      const oppositeLang = language === "en" ? "es" : "en";
      let translatedName = "";
      let translatedRank = "";

      if (editingId) {
        const existingMember: DojoMember | undefined = members.find((m) => m.id === editingId);

        if (!existingMember) {
          toast.error("Member not found");
          return;
        }

        // Only call translation API if the value actually changed
        if (name !== existingMember[language].name) {
          translatedName = await translateText(name, oppositeLang);
        } else {
          translatedName = existingMember[oppositeLang].name;
        }

        if (rank !== existingMember[language].rank) {
          translatedRank = await translateText(rank, oppositeLang);
        } else {
          translatedRank = existingMember[oppositeLang].rank;
        }

        const updateData: Partial<DojoMember> = {
          en: language === "en"
            ? { name, rank }
            : { name: translatedName, rank: translatedRank },
          es: language === "es"
            ? { name, rank }
            : { name: translatedName, rank: translatedRank },
          sourceLang: language,
          joinDate,
          updatedAt: new Date().toISOString(),
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateMember(editingId, updateData);
        toast.success(content.admin.members.toast_success_update, {
          id: loadingToast,
        });
      } else {
        // Translation for new document
        translatedName = await translateText(name, oppositeLang);
        translatedRank = await translateText(rank, oppositeLang);

        const addMember: Omit<DojoMember, "id"> = {
          en: language === "en"
            ? { name, rank }
            : { name: translatedName, rank: translatedRank },
          es: language === "es"
            ? { name, rank }
            : { name: translatedName, rank: translatedRank },
          sourceLang: language,
          joinDate,
          imageUrl: finalImageUrl || "",
          createdAt: new Date().toISOString(),
        };

        await createMember(addMember);
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
      await deleteMember(id);
      toast.success(content.admin.members.toast_deleted);
      fetchMembers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.members.toast_error_delete + errorMessage);
    }
  };

  return {
    members,
    loading,
    saving,
    isModalOpen,
    editingId,
    name,
    setName,
    rank,
    setRank,
    joinDate,
    setJoinDate,
    imageFile,
    setImageFile,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    setIsModalOpen,
  };
}
