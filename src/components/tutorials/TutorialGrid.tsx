import React from 'react'
import { cn } from '@site/src/lib/utils'
import { Tutorial } from './models'
import { HoverEffect } from '@site/src/components/ui/card-hover-effect'
import TutorialCardWithHover from './TutorialCardWithHover'

interface TutorialGridProps {
  tutorials: Tutorial[]
  className?: string
}

export const TutorialGrid: React.FC<TutorialGridProps> = ({ tutorials, className }) => {
  if (tutorials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No tutorials found matching your criteria.</p>
      </div>
    )
  }

  // Transform tutorials into the format expected by HoverEffect
  const hoverItems = tutorials.map((tutorial) => ({
    id: tutorial.meta.id,
    content: <TutorialCardWithHover tutorial={tutorial} />,
  }))

  return (
    <HoverEffect
      items={hoverItems}
      className={className}
    />
  )
}

export default TutorialGrid