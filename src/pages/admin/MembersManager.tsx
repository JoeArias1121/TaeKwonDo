import {
  Trash2,
  Plus,
  Image as ImageIcon,
  Loader2,
  Edit,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMembersManager } from "@/hooks/useMembersManager";
import { MemberModal } from "./components/MemberModal";

export default function MembersManager() {
  const { content, language } = useLanguage();
  const {
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
  } = useMembersManager();

  return (
    <div className="w-full min-h-full font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black">
            {content.admin.members.title}
          </h1>
          <p className="text-muted-foreground">
            {content.admin.members.subtitle}
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
          {content.admin.members.add_member}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center auto-rows-fr">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : members.length === 0 ? (
          <div className="col-span-full bg-card border border-dashed rounded-3xl p-12 text-center text-muted-foreground">
            {content.admin.members.no_members}
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="bg-card border rounded-3xl p-6 flex items-start gap-5 shadow-sm overflow-hidden w-full max-w-sm h-full border-border/60 transition-all hover:shadow-md"
            >
              <div className="w-20 h-20 bg-secondary/20 rounded-full overflow-hidden flex-shrink-0 border-2 border-background shadow-md">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member[language].name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col min-h-[5rem] min-w-0">
                <h3 className="font-heading font-bold text-xl break-words leading-tight">
                  {member[language].name}
                </h3>
                <p className="text-sm text-primary font-bold uppercase tracking-wider break-words">
                  {member[language].rank}
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  {content.admin.members.joined}
                  {member.joinDate}
                </p>

                <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border/50">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Edit Member"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member[language].name)}
                    className="text-destructive bg-destructive/10 hover:bg-destructive/20 p-2 rounded-xl transition-all shadow-sm active:scale-95"
                    title="Remove Member"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <MemberModal
        isOpen={isModalOpen}
        editingId={editingId}
        onClose={resetForm}
        name={name}
        setName={setName}
        rank={rank}
        setRank={setRank}
        joinDate={joinDate}
        setJoinDate={setJoinDate}
        imageFile={imageFile}
        setImageFile={setImageFile}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
