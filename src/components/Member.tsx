import React from 'react'

export default function Member({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <div>
      <img src={avatarUrl} alt={name} />
      <h1>{name}</h1>
    </div>
  )
}
