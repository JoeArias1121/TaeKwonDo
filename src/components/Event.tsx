

export default function Event({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  return (
    <div className="border w-full border-gray-300 rounded-lg p-4 flex flex-col items-center mb-3">
      <img src={imageUrl} alt={title} className="h-30 md:h-48 rounded-lg mb-2" />
      <h2 className="text-xl font-bold text-center">{title}</h2>
      <p>{description}</p>
      <div className="flex flex-col items-start mt-2">
        <p>Location: Central Park</p>
        <p>Date: 10/15/2023, @10:00 AM</p>
      </div>
    </div>
  )
}
