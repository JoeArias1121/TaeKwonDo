import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GalleryItem } from "@/types";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/api/gallery";
import { optimizeImage } from "@/lib/imageOptimization";

export function useGalleryManager() {
  const { content } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [order, setOrder] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setGalleryItems(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load gallery items: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setOrder(1);
    setImageFile(null);
    setCurrentImageUrl("");
    setIsModalOpen(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setOrder(item.order);
    setCurrentImageUrl(item.imageUrl);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenAddForSlot = (slotNumber: number) => {
    resetForm();
    setOrder(slotNumber);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error(content.admin.gallery.toast_image_req);
      return;
    }

    if (order < 1 || order > 8) {
      toast.error("Order must be between 1 and 8.");
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingId
        ? content.admin.gallery.toast_updating
        : content.admin.gallery.toast_saving,
    );

    try {
      let finalImageUrl = currentImageUrl;

      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(
          storage,
          `gallery/${Date.now()}_${imageFile.name.split(".")[0]}.webp`,
        );

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      // Check if another item is already in this slot (order)
      const duplicateItem = galleryItems.find(
        (item) => item.order === order && item.id !== editingId,
      );

      if (duplicateItem) {
        // Automatically remove the duplicate item in that slot to keep slots unique 1-8
        await deleteGalleryItem(duplicateItem.id);
      }

      if (editingId) {
        const updateData: Partial<GalleryItem> = {
          order,
          imageUrl: finalImageUrl,
          updatedAt: new Date().toISOString(),
        };
        await updateGalleryItem(editingId, updateData);
        toast.success(content.admin.gallery.toast_success_update, {
          id: loadingToast,
        });
      } else {
        const addItem: Omit<GalleryItem, "id"> = {
          order,
          imageUrl: finalImageUrl,
          createdAt: new Date().toISOString(),
        };
        await createGalleryItem(addItem);
        toast.success(content.admin.gallery.toast_success_create, {
          id: loadingToast,
        });
      }

      resetForm();
      fetchGallery();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.gallery.toast_error_save + errorMessage, {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(content.admin.gallery.confirm_delete)) return;

    try {
      await deleteGalleryItem(id);
      toast.success(content.admin.gallery.toast_deleted);
      fetchGallery();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.gallery.toast_error_delete + errorMessage);
    }
  };

  return {
    galleryItems,
    loading,
    saving,
    isModalOpen,
    editingId,
    order,
    setOrder,
    imageFile,
    setImageFile,
    currentImageUrl,
    handleSave,
    handleEdit,
    handleDelete,
    handleOpenAddForSlot,
    resetForm,
    setIsModalOpen,
  };
}
