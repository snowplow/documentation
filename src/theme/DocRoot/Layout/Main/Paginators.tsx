import React from 'react'
import clsx from 'clsx'

import PaginatorNavLink from '@theme/PaginatorNavLink'
import { Step } from '@site/src/components/tutorials/models'

export const Paginators: React.FC<{
  next: Step | null
  prev: Step | null
  setActiveStep: (step: Step) => void
  className?: string
  currentStep?: Step | null
  tutorialId?: string
}> = ({ next, prev, setActiveStep, className, currentStep, tutorialId }) => {

  // Function to mark current step as completed in localStorage
  const markCurrentStepCompleted = () => {
    if (!currentStep || !tutorialId) return

    const stepKey = currentStep.path || currentStep.id
    if (!stepKey) return

    // Get existing completed steps from localStorage
    const storedVisited = localStorage.getItem(`tutorial-progress-${tutorialId}`)
    const visitedSteps = storedVisited ? new Set(JSON.parse(storedVisited)) : new Set()

    // Add current step to completed steps
    visitedSteps.add(stepKey)

    // Save back to localStorage
    localStorage.setItem(`tutorial-progress-${tutorialId}`, JSON.stringify([...visitedSteps]))
  }

  // Enhanced setActiveStep that also marks completion
  const handleNextClick = (step: Step) => {
    markCurrentStepCompleted()
    setActiveStep(step)
  }
  return (
    <nav className={clsx('tutorial-paginator', className)} aria-label="Tutorial steps">
      {prev ? (
        <PaginatorNavLink
          onClick={() => setActiveStep(prev)}
          isNext={false}
          permalink={prev.path}
          title={prev.title}
          subLabel="Previous"
        />
      ) : (
        <span />
      )}
      {next && (
        <PaginatorNavLink
          onClick={() => handleNextClick(next)}
          isNext={true}
          permalink={next.path}
          title={next.title}
          subLabel="Next"
        />
      )}
    </nav>
  )
}
