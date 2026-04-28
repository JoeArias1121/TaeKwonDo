export default function Member({ name, avatarUrl, rank }: { name: string; avatarUrl?: string; rank: string }) {
  return (
    <div className="group flex flex-col items-center bg-card border rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 w-full max-w-[280px]">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
        <img 
            src={avatarUrl} 
            alt={name} 
            className="relative w-24 h-24 rounded-full object-cover border-4 border-background shadow-md group-hover:-translate-y-1 transition-transform duration-300 z-10" 
        />
      </div>
      <h3 className="text-lg font-heading font-bold text-center mt-2 group-hover:text-primary transition-colors">{name}</h3>
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1 text-center">{rank}</span>
    </div>
  )
}
