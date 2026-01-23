

export default function Event({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  return (
    <div>
      <img src={imageUrl} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
