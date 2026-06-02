import { Loader2, Save, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePresidentEditor } from "@/hooks/usePresidentEditor";
import { useBoardMembersManager } from "@/hooks/useBoardMembersManager";
import { BoardMemberModal } from "./components/BoardMemberModal";

export default function BoardEditor() {
  const { content, language } = useLanguage();

  // President Form State
  const {
    loading: presidentLoading,
    saving: presidentSaving,
    name: presName,
    setName: setPresName,
    belt: presBelt,
    setBelt: setPresBelt,
    bio: presBio,
    setBio: setPresBio,
    currentImageUrl: presImageUrl,
    imageFile: presImageFile,
    setImageFile: setPresImageFile,
    handleSave: handlePresSave,
  } = usePresidentEditor();

  // Secondary Board Members State
  const {
    boardMembers,
    loading: boardLoading,
    saving: boardSaving,
    isModalOpen,
    editingId,
    name: boardName,
    setName: setBoardName,
    role: boardRole,
    setRole: setBoardRole,
    belt: boardBelt,
    setBelt: setBoardBelt,
    bio: boardBio,
    setBio: setBoardBio,
    order: boardOrder,
    setOrder: setBoardOrder,
    imageFile: boardImageFile,
    setImageFile: setBoardImageFile,
    handleSave: handleBoardSave,
    handleEdit: handleBoardEdit,
    handleDelete: handleBoardDelete,
    resetForm: resetBoardForm,
    setIsModalOpen: setIsBoardModalOpen,
  } = useBoardMembersManager();

  const loading = presidentLoading || boardLoading;

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

      {/* President (Guaranteed Position) Form */}
      <div className="bg-card border rounded-3xl p-8 shadow-sm mb-12">
        <h2 className="text-xl font-heading font-bold mb-6 text-primary uppercase tracking-wider">
          {content.admin.board.president_position}
        </h2>
        <form onSubmit={handlePresSave} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Image Preview Area */}
            <div className="flex flex-col gap-3 w-full sm:w-1/3">
              <label className="text-sm font-bold">
                {content.admin.about.profile_avatar}
              </label>
              <div className="w-full aspect-square bg-secondary/20 rounded-2xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center relative">
                {presImageFile ? (
                  <img
                    src={URL.createObjectURL(presImageFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : presImageUrl ? (
                  <img
                    src={presImageUrl}
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
                  {presImageFile ? presImageFile.name : content.admin.about.form_avatar_select}
                </span>
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold flex-shrink-0">
                  {content.admin.about.form_avatar_browse}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPresImageFile(e.target.files?.[0] || null)}
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
                  value={presName}
                  onChange={(e) => setPresName(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  {content.admin.about.display_belt}
                </label>
                <input
                  required
                  type="text"
                  value={presBelt}
                  onChange={(e) => setPresBelt(e.target.value)}
                  placeholder={content.admin.about.display_belt_placeholder}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>

              <div className="flex-grow">
                <label className="block text-sm font-bold mb-1">
                  {content.admin.about.bio}
                </label>
                <textarea
                  required
                  value={presBio}
                  onChange={(e) => setPresBio(e.target.value)}
                  rows={6}
                  className="w-full border rounded-xl px-4 py-2 bg-input/50 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t pt-6 mt-2">
            <button
              type="submit"
              disabled={presidentSaving}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {presidentSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {presidentSaving
                ? content.admin.about.btn_saving
                : content.admin.about.btn_save}
            </button>
          </div>
        </form>
      </div>

      {/* Horizontal Line separating President and other positions */}
      <hr className="border-border/80 my-8" />

      {/* Secondary Positions Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-black">
            {content.admin.board.other_title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {content.admin.board.other_subtitle}
          </p>
        </div>
        <button
          onClick={() => {
            resetBoardForm();
            setIsBoardModalOpen(true);
          }}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          {content.admin.board.add_member}
        </button>
      </div>

      {/* Secondary Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center auto-rows-fr mb-12">
        {boardMembers.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground w-full">
            {content.admin.board.no_members}
          </div>
        ) : (
          boardMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card border rounded-3xl p-6 flex items-start gap-5 shadow-sm overflow-hidden w-full h-full border-border/60 transition-all hover:shadow-md"
            >
              <div className="w-20 h-20 bg-secondary/20 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-md">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col min-h-[5rem] min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-heading font-bold text-xl break-words leading-tight">
                    {member.name}
                  </h3>
                  <span className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full font-bold">
                    {content.admin.board.order}: {member.order}
                  </span>
                </div>
                <p className="text-sm text-primary font-bold uppercase tracking-wider break-words mt-0.5">
                  {member[language].role}
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {member[language].bio}
                </p>

                <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-border/50">
                  <button
                    onClick={() => handleBoardEdit(member)}
                    className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title={content.admin.board.btn_edit_tooltip}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleBoardDelete(member.id, member.name)}
                    className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title={content.admin.board.btn_delete_tooltip}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Board Member Modal */}
      <BoardMemberModal
        isOpen={isModalOpen}
        editingId={editingId}
        onClose={resetBoardForm}
        title={boardName}
        setTitle={setBoardName}
        role={boardRole}
        setRole={setBoardRole}
        belt={boardBelt}
        setBelt={setBoardBelt}
        bio={boardBio}
        setBio={setBoardBio}
        order={boardOrder}
        setOrder={setBoardOrder}
        imageFile={boardImageFile}
        setImageFile={setBoardImageFile}
        onSave={handleBoardSave}
        saving={boardSaving}
      />
    </div>
  );
}
