import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import { Tutorial } from './models'
import { getSteps } from './utils'

// Function to get tutorial progress from localStorage
function getTutorialProgress(
  tutorialId: string,
  totalSteps: number
): { completed: number; percentage: number } {
  if (typeof window === 'undefined') return { completed: 0, percentage: 0 }

  const storedVisited = localStorage.getItem(`tutorial-progress-${tutorialId}`)
  const visitedSteps = storedVisited
    ? new Set(JSON.parse(storedVisited))
    : new Set()
  const completed = visitedSteps.size
  const percentage =
    totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0
  return { completed, percentage }
}

function getFirstStepPath(tutorialId: string): string | null {
  const steps = getSteps(tutorialId)
  if (steps.length === 0) {
    return null
  }
  return steps[0].path
}

const gridColumns =
  'lg:grid lg:grid-cols-[minmax(0,3.2fr)_minmax(0,1fr)_minmax(0,1fr)_5rem] lg:gap-5 lg:items-center'

const TutorialRow: React.FC<{ tutorial: Tutorial }> = ({ tutorial }) => {
  const firstStep = getFirstStepPath(tutorial.meta.id)
  const progress = getTutorialProgress(tutorial.meta.id, tutorial.steps.length)

  const rowContent = (
    <div
      className={cn(
        'px-4 py-4 transition-colors duration-150',
        firstStep && 'group-hover:bg-muted',
        gridColumns
      )}
    >
      {/* Tutorial title and description */}
      <div className="mb-2 lg:mb-0 lg:pr-2">
        <div className="text-base font-semibold text-foreground leading-snug">
          {firstStep
            ? tutorial.meta.title
            : `${tutorial.meta.title} (No steps found)`}
        </div>
        <p className="text-muted-foreground text-sm leading-normal mt-1 mb-0 lg:truncate">
          {tutorial.meta.description}
        </p>
      </div>

      {/* Use case */}
      <div className="mb-1 lg:mb-0 text-sm text-foreground">
        <span className="lg:hidden text-muted-foreground mr-1.5">
          Use case:
        </span>
        {tutorial.meta.useCase}
      </div>

      {/* Technologies */}
      <div className="mb-1 lg:mb-0 text-sm text-foreground">
        <span className="lg:hidden text-muted-foreground mr-1.5">
          Technology:
        </span>
        {tutorial.meta.technologies.length > 0 ? (
          tutorial.meta.technologies.join(', ')
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 lg:flex-col lg:items-end lg:gap-1">
        <span className="lg:hidden text-sm text-muted-foreground">
          Progress:
        </span>
        <span className="text-sm text-foreground tabular-nums">
          {progress.completed}/{tutorial.steps.length}
        </span>
        <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  )

  return firstStep ? (
    <Link
      to={firstStep}
      className="group block text-inherit hover:text-inherit hover:no-underline"
    >
      {rowContent}
    </Link>
  ) : (
    <div className="opacity-60">{rowContent}</div>
  )
}

interface TutorialTableProps {
  tutorials: Tutorial[]
  className?: string
}

export const TutorialTable: React.FC<TutorialTableProps> = ({
  tutorials,
  className,
}) => {
  if (tutorials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No tutorials found matching your criteria.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Column headers - desktop only */}
      <div
        className={cn(
          'hidden px-4 pb-2 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide',
          gridColumns
        )}
      >
        <div>Tutorial</div>
        <div>Use case</div>
        <div>Technology</div>
        <div className="lg:text-right">Progress</div>
      </div>

      <div className="divide-y divide-border">
        {tutorials.map((tutorial) => (
          <TutorialRow key={tutorial.meta.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  )
}

export default TutorialTable
