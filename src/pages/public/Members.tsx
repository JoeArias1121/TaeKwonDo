import avatar from '@/assets/avatar.jpg'
import Member from '@/components/Member'

export default function Members() {

  const members = []

  for (let i = 0; i < 10; i++) {
    members.push(
      <Member key={i} name={`Member ${i + 1}`} avatarUrl={avatar} />
    )
  }

  return (
    <div className="flex flex-wrap gap-15  lg:gap-20 justify-center">
      {members}
    </div>
  )
}
