import React from 'react'

export default function NotebookLinks({ path }) {
  const colabUrl = `https://colab.research.google.com/github/${path}`

  return (
    <div className="not-prose flex flex-wrap items-center gap-2 mb-4">
      <a href={colabUrl} target="_blank" rel="noopener noreferrer">
        <img
          src="https://colab.research.google.com/assets/colab-badge.svg"
          alt="Open in Colab"
        />
      </a>
    </div>
  )
}
