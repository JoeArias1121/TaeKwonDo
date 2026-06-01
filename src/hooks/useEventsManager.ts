import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DojoEvent, EventType } from "@/types";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/api/events";
import { translateText } from "@/api/translate";
import { optimizeImage } from "@/lib/imageOptimization";

export function useEventsManager() {
  const { content, language } = useLanguage();
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>(
    language === "en" ? "Competition" : "Competición",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Failed to load events: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setEventType(language === "en" ? "Competition" : "Competición");
    setDate("");
    setTime("");
    setLocation("");
    setImageFile(null);
    setIsModalOpen(false);
  };

  const handleEdit = (evt: DojoEvent) => {
    setEditingId(evt.id);
    const langMap = evt[language];
    setTitle(langMap.title);
    setDescription(langMap.description);
    setEventType(langMap.eventType);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const eventTypeHelper = (eventType: string): EventType => {
    switch (eventType) {
      case "Competition":
        return "Competición";
      case "Fundraising":
        return "Donación";
      case "Ceremony":
        return "Ceremonia";
      case "Seminar":
        return "Seminario";
      case "Competición":
        return "Competition";
      case "Donación":
        return "Fundraising";
      case "Ceremonia":
        return "Ceremony";
      case "Seminario":
        return "Seminar";
    }
    return "Competition";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error(content.admin.events.toast_image_req);
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      editingId
        ? content.admin.events.toast_updating
        : content.admin.events.toast_saving,
    );

    try {
      let finalImageUrl: string | undefined;

      if (imageFile) {
        const optimizedFile = await optimizeImage(imageFile);
        const storageRef = ref(
          storage,
          `events/${Date.now()}_${imageFile.name.split(".")[0]}.webp`,
        );

        const metadata = {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000",
        };

        await uploadBytes(storageRef, optimizedFile, metadata);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      const oppositeLang = language === "en" ? "es" : "en";
      let translatedTitle = "";
      let translatedDescription = "";

      if (editingId) {
        const existingEvent = events.find((evt) => evt.id === editingId);

        if (title !== existingEvent?.[language]?.title) {
          translatedTitle = await translateText(title, oppositeLang);
        } else {
          translatedTitle = existingEvent?.[oppositeLang]?.title || "";
        }

        if (description !== existingEvent?.[language]?.description) {
          translatedDescription = await translateText(description, oppositeLang);
        } else {
          translatedDescription = existingEvent?.[oppositeLang]?.description || "";
        }

        const updateData: Partial<DojoEvent> = {
          en: language === "en"
            ? { title, description, eventType }
            : { title: translatedTitle, description: translatedDescription, eventType: eventTypeHelper(eventType) },
          es: language === "es"
            ? { title, description, eventType }
            : { title: translatedTitle, description: translatedDescription, eventType: eventTypeHelper(eventType) },
          sourceLang: language,
          date,
          time,
          location,
          updatedAt: new Date().toISOString(),
        };
        if (finalImageUrl) updateData.imageUrl = finalImageUrl;

        await updateEvent(editingId, updateData);
        toast.success(content.admin.events.toast_success_update, {
          id: loadingToast,
        });
      } else {
        translatedTitle = await translateText(title, oppositeLang);
        translatedDescription = await translateText(description, oppositeLang);

        const addEvent: Omit<DojoEvent, "id"> = {
          en: language === "en"
            ? { title, description, eventType }
            : { title: translatedTitle, description: translatedDescription, eventType: eventTypeHelper(eventType) },
          es: language === "es"
            ? { title, description, eventType }
            : { title: translatedTitle, description: translatedDescription, eventType: eventTypeHelper(eventType) },
          sourceLang: language,
          date,
          time,
          location,
          imageUrl: finalImageUrl || "",
          createdAt: new Date().toISOString(),
        };

        await createEvent(addEvent);
        toast.success(content.admin.events.toast_success_create, {
          id: loadingToast,
        });
      }

      resetForm();
      fetchEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.events.toast_error_save + errorMessage, {
        id: loadingToast,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(content.admin.events.confirm_delete)) return;

    try {
      await deleteEvent(id);
      toast.success(content.admin.events.toast_deleted);
      fetchEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(content.admin.events.toast_error_delete + errorMessage);
    }
  };

  return {
    events,
    loading,
    saving,
    isModalOpen,
    editingId,
    title,
    setTitle,
    description,
    setDescription,
    eventType,
    setEventType,
    date,
    setDate,
    time,
    setTime,
    location,
    setLocation,
    imageFile,
    setImageFile,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
    setIsModalOpen,
  };
}
