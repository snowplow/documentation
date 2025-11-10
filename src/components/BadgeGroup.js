import React from 'react'

export default function BadgeGroup({ children }) {
  return (
    <div className="flex flex-wrap items-center gap-1 mt-10 mb-2">
      {children}
    </div>
  )
}