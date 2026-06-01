import { Loader2, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAboutEditor } from "@/hooks/useAboutEditor";

export default function AboutEditor() {
  const { content } = useLanguage();
  const {
    loading,
    saving,
    title,
    setTitle,
    role,
    setRole,
    bio,
    setBio,
    currentImageUrl,
    imageFile,
    setImageFile,
    handleSave,
  } = useAboutEditor();

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
              <label className="w-full flex items-center justify-between border border-dashed rounded-xl px-3 py-2 bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-all border-border/80">
                <span className="text-xs text-muted-foreground truncate mr-2">
                  {imageFile ? imageFile.name : content.admin.about.form_avatar_select}
                </span>
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold flex-shrink-0">
                  {content.admin.about.form_avatar_browse}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
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
