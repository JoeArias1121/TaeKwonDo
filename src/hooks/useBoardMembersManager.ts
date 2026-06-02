import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BoardMember } from "@/types";
import {
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
} from "@/api/board";
import { translateText } from "@/api/translate";
import { optimizeImage } from "@/lib/imageOptimization";

export function useBoardMembersManager() {
  const { content, language } = useLanguage();
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [belt, setBelt] = useState("");
  const [bio, setBio] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      const data = await getBoardMembers();
      setBoardMembers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load board members: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardMembers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setBelt("");
    setBio("");
    setOrder(boardMembers.length + 1);
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleEdit = (member: BoardMember) => {
    setEditingId(member.id);
    setName(member.name || "");
    const langMap = member[language];
    setRole(langMap.role);
    setBelt(langMap.belt || "");
    setBio(langMap.bio);
    setOrder(member.order || 1);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error(content.admin.board.toast_image_req);
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingId
        ? content.admin.board.toast_updating
        : content.admin.board.toast_saving
    );

    try {
      let finalImageUrl: string | undefined;

      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(
          storage,
          `board/${Date.now()}_${imageFile.name.split(".")[0]}.webp`
        );

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const oppositeLang = language === "en" ? "es" : "en";
      let translatedRole = "";
      let translatedBio = "";
      let translatedBelt = "";

      if (editingId) {
        const existingMember = boardMembers.find((m) => m.id === editingId);

        if (!existingMember) {
          toast.error("Board member not found");
          return;
        }

        if (role !== existingMember[language].role) {
          translatedRole = await translateText(role, oppositeLang);
        } else {
          translatedRole = existingMember[oppositeLang].role;
        }

        if (bio !== existingMember[language].bio) {
          translatedBio = await translateText(bio, oppositeLang);
        } else {
          translatedBio = existingMember[oppositeLang].bio;
        }

        if (belt !== existingMember[language].belt) {
          translatedBelt = await translateText(belt, oppositeLang);
        } else {
          translatedBelt = existingMember[oppositeLang].belt || "";
        }

        const updateData: Partial<BoardMember> = {
          name,
          en: language === "en"
            ? { role, bio, belt }
            : { role: translatedRole, bio: translatedBio, belt: translatedBelt },
          es: language === "es"
            ? { role, bio, belt }
            : { role: translatedRole, bio: translatedBio, belt: translatedBelt },
          sourceLang: language,
          order,
          updatedAt: new Date().toISOString(),
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateBoardMember(editingId, updateData);
        toast.success(content.admin.board.toast_success_update, {
          id: loadingToast,
        });
      } else {
        translatedRole = await translateText(role, oppositeLang);
        translatedBio = await translateText(bio, oppositeLang);
        translatedBelt = await translateText(belt, oppositeLang);

        const addMember: Omit<BoardMember, "id"> = {
          name,
          en: language === "en"
            ? { role, bio, belt }
            : { role: translatedRole, bio: translatedBio, belt: translatedBelt },
          es: language === "es"
            ? { role, bio, belt }
            : { role: translatedRole, bio: translatedBio, belt: translatedBelt },
          sourceLang: language,
          order,
          imageUrl: finalImageUrl || "",
          createdAt: new Date().toISOString(),
        };

        await createBoardMember(addMember);
        toast.success(content.admin.board.toast_success_create, {
          id: loadingToast,
        });
      }

      resetForm();
      fetchBoardMembers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Error saving: " + errorMessage, {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (
      !window.confirm(`${content.admin.board.confirm_delete}${memberName}?`)
    )
      return;

    try {
      await deleteBoardMember(id);
      toast.success(content.admin.board.toast_deleted);
      fetchBoardMembers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.board.toast_error_delete + errorMessage);
    }
  };

  return {
    boardMembers,
    loading,
    saving,
    isModalOpen,
    editingId,
    name,
    setName,
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
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    setIsModalOpen,
  };
}
