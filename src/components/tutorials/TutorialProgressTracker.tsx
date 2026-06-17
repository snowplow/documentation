import React, { useState, useEffect } from 'react'
import { ChevronRight, ArrowLeft, Check, X, ListChecks } from 'lucide-react'
import { cn } from '@site/src/lib/utils'
import { Button } from '@site/src/components/ui/button'
import RadialProgress from './RadialProgress'
import styles from './TutorialProgressTracker.module.css'
import { useHistory } from '@docusaurus/router'

interface TutorialProgressTrackerProps {
  className?: string
  meta?: any
  steps?: any[]
  activeStep?: any
  setActiveStep?: (step: any) => void
}

export const TutorialProgressTracker: React.FC<TutorialProgressTrackerProps> = ({
  className,
  meta,
  steps = [],
  activeStep,
  setActiveStep
}) => {
  const history = useHistory()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set())
  const [stepReadingProgress, setStepReadingProgress] = useState<Map<string, number>>(new Map())
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set client flag once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load visited steps from localStorage
  useEffect(() => {
    if (!meta?.id || typeof window === 'undefined' || !isClient) return

    const loadProgress = () => {
      try {
        const storedVisited = localStorage.getItem(`tutorial-progress-${meta.id}`)
        if (storedVisited) {
          const parsed = JSON.parse(storedVisited)
          if (Array.isArray(parsed)) {
            const validSteps = parsed.filter(item => typeof item === 'string' && item.length > 0)
            if (validSteps.length > 0) {
              setVisitedSteps(new Set(validSteps))
            } else {
              localStorage.removeItem(`tutorial-progress-${meta.id}`)
            }
          }
        }
      } catch (error) {
        localStorage.removeItem(`tutorial-progress-${meta.id}`)
      }
    }

    if (typeof localStorage !== 'undefined') {
      loadProgress()
    } else {
      setTimeout(loadProgress, 100)
    }
  }, [meta?.id, isClient])




  // Helper function to get consistent step key
  const getStepKey = (step: any) => {
    return step.path || step.id
  }

  // Auto-complete current step when user scrolls to bottom
  useEffect(() => {
    if (!activeStep || !meta?.id || typeof window === 'undefined') return

    const isScrolledToBottom = scrollProgress >= 90
    const stepKey = getStepKey(activeStep)

    if (isScrolledToBottom && stepKey && !visitedSteps.has(stepKey)) {
      // Ensure we only store strings, not nested Sets
      const currentSteps = Array.from(visitedSteps).filter(item => typeof item === 'string')
      const newSteps = [...currentSteps, stepKey].filter((item, index, arr) =>
        typeof item === 'string' && arr.indexOf(item) === index // deduplicate
      )
      const newVisited = new Set(newSteps)
      setVisitedSteps(newVisited)

      try {
        const dataToSave = Array.from(newVisited)
        localStorage.setItem(`tutorial-progress-${meta.id}`, JSON.stringify(dataToSave))
      } catch (error) {
        // Silently fail - tutorial progress is not critical
      }
    }
  }, [scrollProgress, activeStep, meta?.id, visitedSteps])

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigate to tutorial step
  const navigateToStep = (step: any) => {
    if (setActiveStep) {
      setActiveStep(step)
    }
    // Navigate to the step's path using React Router
    history.push(step.path)
  }



  // Get progress percentage based on completed steps
  const getCurrentStepProgress = () => {
    if (steps.length === 0) return 0
    const completedCount = steps.filter(step => {
      const stepKey = getStepKey(step)
      return visitedSteps.has(stepKey)
    }).length
    return (completedCount / steps.length) * 100
  }

  // Check if step is completed
  const isStepCompleted = (step: any) => {
    const stepKey = getStepKey(step)
    return visitedSteps.has(stepKey)
  }

  // Check if step is current - use strict equality and null checks
  const isStepCurrent = (step: any) => {
    if (!activeStep || !step) return false
    // Use strict path comparison
    return step.path === activeStep.path
  }

  // Get reading progress for a step (0-100)
  const getStepReadingProgress = (step: any) => {
    const isCurrent = isStepCurrent(step)
    const isCompleted = isStepCompleted(step)

    // If step is completed, show 100%
    if (isCompleted) {
      return 100
    }

    // Only show scroll progress for the current active step
    if (isCurrent) {
      return scrollProgress
    }

    // All other steps show 0% progress
    return 0
  }

  if (steps.length === 0) {
    return null
  }

  return (
    <>
      {/* Tutorial Chapters Button - Mobile Only */}
      <div className="w-full flex justify-end mb-4 block md:hidden">
        <Button
          variant="outline"
          size="lg"
          className="w-auto justify-between border border-border bg-card hover:bg-accent text-foreground font-regular py-3 px-4 rounded-lg shadow-sm"
          onClick={() => setIsSheetOpen(true)}
        >
          <span className="text-base font-regular">Tutorial Chapters</span>
          <ListChecks className="w-5 h-5 ml-2 text-foreground" />
        </Button>
      </div>

      <div className={cn("h-fit sticky", styles.tutorialProgressTracker, className)} style={{ zIndex: 10 }}>
        {/* Header Card */}
      <div className="bg-accent text-foreground rounded-lg p-6 mb-4 leading-tight">
      <div className="flex flex-wrap gap-1 mb-4">
          {meta?.label && (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[.675rem] font-normal">
              {meta.label}
            </div>
          )}
          {meta?.useCase && (
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-[.675rem] font-normal">
              {meta.useCase}
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {meta?.title || 'Tutorial'}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {meta?.description || 'Track your progress through this tutorial'}
        </p>

        

        {/* Overall Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(getCurrentStepProgress())}%</span>
          </div>
          <div className="w-full bg-muted/90 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getCurrentStepProgress()}%` }}
            />
          </div>
        </div>

              {/* Tutorial Steps List - Hidden on mobile since they're in the sheet */}
      <div className="space-y-2 hidden md:block">
        {steps.map((step, index) => {
          const isActive = isStepCurrent(step)
          const isCompleted = isStepCompleted(step)
          const isFuture = !isActive && !isCompleted

          return (
            <div
              key={step.path || step.id}
              onClick={() => navigateToStep(step)}
              className={cn(
                "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200",
                "hover:bg-accent/50",
                isActive && isCompleted && "bg-primary/10 border border-green-300/40 hover:bg-foreground/5",
                isActive && !isCompleted && "bg-primary/25 border border-primary/20 hover:bg-foreground/5",
                !isActive && isCompleted && "bg-transparent hover:bg-foreground/5",
                isFuture && "bg-transparent border border-border hover:bg-foreground/5"
              )}
            >
              {/* Step Number with Radial Progress or Check */}
              <div className="flex-shrink-0 mr-3">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                ) : (
                  <RadialProgress
                    progress={getStepReadingProgress(step)}
                    size={32}
                    strokeWidth={4}
                    className={cn(
                      isActive && "text-primary",
                      isFuture && "text-foreground"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      isActive && "text-primary",
                      isFuture && "text-muted-foreground"
                    )}>
                      {step.position || index + 1}
                    </span>
                  </RadialProgress>
                )}
              </div>

              {/* Step Title */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-light truncat m-0",
                  isActive && "text-primary",
                  isCompleted && "text-muted-foreground",
                  isFuture && "text-foreground"
                )}>
                  {step.sidebar_label || step.title}
                </p>
              </div>

              {/* Navigation Arrow 
              <ChevronRight className={cn(
                "w-4 h-4 ml-2 flex-shrink-0",
                isActive && "text-primary",
                isCompleted && "text-foreground",
                isFuture && "text-muted-foreground"
              )} />
              */}
            </div>
          )
        })}
      </div>
      </div>




      {/* Back to Tutorials Button - Hidden on mobile */}
      <div className="mt-4 hidden md:block">
        <Button
          variant="outline"
          size="lg"
          className="justify-start gap-2 rounded-lg"
          onClick={() => window.location.href = '/tutorials'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutorials
        </Button>
      </div>
    </div>

    {/* Mobile Tutorial Chapters Sheet */}
    {isSheetOpen && (
      <div className="fixed inset-0 z-50 block md:hidden">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setIsSheetOpen(false)}
        />

        {/* Sheet Content */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
          {/* Sheet Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Tutorial Chapters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tutorial Steps List */}
          <div className="p-4 space-y-2">
            {steps.map((step, index) => {
              const isActive = isStepCurrent(step)
              const isCompleted = isStepCompleted(step)
              const isFuture = !isActive && !isCompleted

              return (
                <div
                  key={step.path || step.id}
                  onClick={() => {
                    navigateToStep(step)
                    setIsSheetOpen(false)
                  }}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-accent/50",
                    isActive && isCompleted && "bg-green-100/80 border border-green-300/40 hover:bg-green-100",
                    isActive && !isCompleted && "bg-primary/10 border border-primary/20",
                    !isActive && isCompleted && "bg-transparent hover:bg-accent",
                    isFuture && "bg-transparent border border-border"
                  )}
                >
                  {/* Step Number with Radial Progress or Check */}
                  <div className="flex-shrink-0 mr-3">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <RadialProgress
                        progress={getStepReadingProgress(step)}
                        size={32}
                        strokeWidth={4}
                        className={cn(
                          isActive && "text-primary",
                          isFuture && "text-foreground"
                        )}
                      >
                        <span className={cn(
                          "text-xs font-medium",
                          isActive && "text-primary",
                          isFuture && "text-muted-foreground"
                        )}>
                          {step.position || index + 1}
                        </span>
                      </RadialProgress>
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-light truncate m-0",
                      isActive && "text-primary",
                      isCompleted && "text-muted-foreground",
                      isFuture && "text-foreground"
                    )}>
                      {step.sidebar_label || step.title}
                    </p>
                  </div>

                  {/* Navigation Arrow */}
                  <ChevronRight className={cn(
                    "w-4 h-4 ml-2 flex-shrink-0",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    isFuture && "text-muted-foreground"
                  )} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )}
  </>
  )
}

export default TutorialProgressTracker