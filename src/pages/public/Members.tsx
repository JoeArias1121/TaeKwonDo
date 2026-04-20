import avatar from '@/assets/avatar.jpg'
import Member from '@/components/Member'

export default function Members() {
  const members = []
  for (let i = 0; i < 10; i++) {
    members.push(
      <Member key={i} name={`Member Name ${i + 1}`} avatarUrl={avatar} />
    )
  }

  return (
    <div className="w-full pb-20">
      <div className="bg-secondary/30 py-16 mb-12 border-b">
         <div className="container mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Dojo Family</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated students and practitioners who make our Taekwon-Do community strong, supportive, and passionate.
            </p>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {members}
        </div>
      </div>
    </div>
  )
}
