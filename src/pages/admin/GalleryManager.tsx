import { Edit, Trash2, Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGalleryManager } from "@/hooks/useGalleryManager";
import { GalleryModal } from "./components/GalleryModal";

export default function GalleryManager() {
  const { content } = useLanguage();
  const {
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
  } = useGalleryManager();

  // Create an array representing slots 1 to 8
  const slots = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="w-full min-h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">
            {content.admin.gallery.title}
          </h1>
          <p className="text-muted-foreground">
            {content.admin.gallery.subtitle}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          {content.admin.gallery.new_image}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map((slotNum) => {
            const item = galleryItems.find((itm) => itm.order === slotNum);

            if (item) {
              return (
                <div
                  key={item.id}
                  className="bg-card border rounded-3xl p-4 flex flex-col gap-4 shadow-sm overflow-hidden w-48 mx-auto relative transition-all hover:shadow-md border-border/60 group"
                >
                  <div className="w-full aspect-square bg-secondary/20 rounded-2xl overflow-hidden border border-border/40 relative">
                    <img
                      src={item.imageUrl}
                      alt={`Slot ${slotNum}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold font-heading border border-white/10">
                      {content.admin.gallery.slot_occupied.replace("{slot}", String(slotNum))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border/50">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                      title={content.admin.gallery.btn_edit_tooltip}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                      title={content.admin.gallery.btn_delete_tooltip}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <button
                  key={`empty-${slotNum}`}
                  onClick={() => handleOpenAddForSlot(slotNum)}
                  className="border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer w-48 h-[248px] mx-auto"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {content.admin.gallery.slot_empty.replace("{slot}", String(slotNum))}
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                    <Plus size={14} /> {content.admin.gallery.btn_add_photo}
                  </span>
                </button>
              );
            }
          })}
        </div>
      )}

      <GalleryModal
        isOpen={isModalOpen}
        editingId={editingId}
        onClose={resetForm}
        order={order}
        setOrder={setOrder}
        imageFile={imageFile}
        setImageFile={setImageFile}
        currentImageUrl={currentImageUrl}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
