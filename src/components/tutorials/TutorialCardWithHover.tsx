import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { Tutorial } from './models'
import { getSteps } from './utils'

// Function to get tutorial progress from localStorage
function getTutorialProgress(tutorialId: string, totalSteps: number): { completed: number, percentage: number } {
  if (typeof window === 'undefined') return { completed: 0, percentage: 0 }

  const storedVisited = localStorage.getItem(`tutorial-progress-${tutorialId}`)
  const visitedSteps = storedVisited ? new Set(JSON.parse(storedVisited)) : new Set()
  const completed = visitedSteps.size
  const percentage = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0
  return { completed, percentage }
}

function getFirstStepPath(tutorialId: string): string | null {
  const steps = getSteps(tutorialId)
  if (steps.length === 0) {
    return null
  }
  return steps[0].path
}

interface TutorialCardWithHoverProps {
  tutorial: Tutorial
  className?: string
}

export const TutorialCardWithHover: React.FC<TutorialCardWithHoverProps> = ({ tutorial, className }) => {
  const firstStep = getFirstStepPath(tutorial.meta.id)
  const progress = getTutorialProgress(tutorial.meta.id, tutorial.steps.length)

  const cardContent = (
    <div className={cn(
      "h-full w-full bg-accent text-popover-foreground border-0 rounded-lg overflow-hidden transition-all duration-300 group-hover:bg-muted group-hover:shadow-lg group-hover:scale-[1.01] flex flex-col",
      className
    )}>
      <div className="p-6 flex-1 flex flex-col">
        {/* Topic/Use Case Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorial.meta.useCase && (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[.675rem] font-normal">
              {tutorial.meta.useCase}
            </div>
          )}
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[.675rem] font-normal">
            {tutorial.meta.label}
          </div>
        </div>

        {/* Title and Description */}
        <div className="flex-1 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-foreground leading-tight">
            {firstStep
              ? tutorial.meta.title
              : `${tutorial.meta.title} (No steps found)`}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {tutorial.meta.description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-sm">Progress</span>
            <span className="text-foreground text-sm">
              {progress.completed}/{tutorial.steps.length}
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="flex gap-1">
            {Array.from({ length: tutorial.steps.length }, (_, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-sm transition-all duration-300",
                  index < progress.completed
                    ? "bg-green-500 rounded-full"
                    : "bg-white/80 rounded-full"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return firstStep ? (
    <Link
      to={firstStep}
      className="block h-full text-inherit hover:text-inherit hover:no-underline"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="h-full opacity-60">
      {cardContent}
    </div>
  )
}

export default TutorialCardWithHover