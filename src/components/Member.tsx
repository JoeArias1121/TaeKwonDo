import React from 'react'

export default function Member({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <div className="flex flex-col items-center">
      <img src={avatarUrl} alt={name} className="w-20 rounded-full" />
      <h1 className="text-center">{name}</h1>
    </div>
  )
}
