import React, { useState, useEffect, useMemo } from 'react'
import { ChevronRight, ArrowLeft, Check } from 'lucide-react'
import { cn } from '@site/src/lib/utils'
import { Button } from '@site/src/components/ui/button'
import RadialProgress from './RadialProgress'

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(new Set())
  const [stepReadingProgress, setStepReadingProgress] = useState<Map<string, number>>(new Map())

  // Load visited steps from localStorage
  useEffect(() => {
    if (!meta?.id) return

    const storedVisited = localStorage.getItem(`tutorial-progress-${meta.id}`)
    if (storedVisited) {
      setVisitedSteps(new Set(JSON.parse(storedVisited)))
    }
  }, [meta?.id])

  // Don't automatically mark steps as visited - only when explicitly completed
  // This effect is removed to prevent auto-completion

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
    // Navigate to the step's path
    window.location.href = step.path
  }

  // Mark current step as completed and navigate to next
  const completeCurrentStep = () => {
    if (!activeStep || !meta?.id) return

    const stepKey = activeStep.path || activeStep.id
    if (stepKey && !visitedSteps.has(stepKey)) {
      const newVisited = new Set([...visitedSteps, stepKey])
      setVisitedSteps(newVisited)
      localStorage.setItem(`tutorial-progress-${meta.id}`, JSON.stringify([...newVisited]))
    }

    // Find next step
    const currentIndex = steps.findIndex(step =>
      isStepCurrent(step)
    )

    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      navigateToStep(nextStep)
    }
  }

  // Check if user has scrolled to bottom (90% threshold)
  const isScrolledToBottom = scrollProgress >= 90

  // Get progress percentage based on completed steps
  const getCurrentStepProgress = () => {
    if (steps.length === 0) return 0
    const completedCount = steps.filter(step => {
      const stepKey = step.path || step.id
      return visitedSteps.has(stepKey)
    }).length
    return (completedCount / steps.length) * 100
  }

  // Check if step is completed
  const isStepCompleted = (step: any) => {
    const stepKey = step.path || step.id
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
    <div className={cn("w-80 h-fit sticky top-8", className)}>
      {/* Header Card */}
      <div className="bg-slate-800 text-white rounded-lg p-6 mb-4 leading-tight">
        <h3 className="text-xl font-semibold mb-2">
          {meta?.title || 'Tutorial'}
        </h3>
        <p className="text-slate-300 text-sm mb-4">
          {meta?.description || 'Track your progress through this tutorial'}
        </p>

        <div className="flex gap-1 mb-4">
          {meta?.label && (
            <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
              {meta.label}
            </div>
          )}
          {meta?.useCases && meta.useCases.map((useCase: string, index: number) => (
            <div key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
              {useCase}
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(getCurrentStepProgress())}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getCurrentStepProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tutorial Steps List */}
      <div className="space-y-2">
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
                isActive && "bg-primary/10 border border-primary/20",
                isCompleted && "bg-transparent hover:bg-accent",
                isFuture && "bg-transparent border border-border"
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
                  {step.title}
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


      {/* Back to Tutorials Button */}
      <div className="mt-4">
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
  )
}

export default TutorialProgressTracker