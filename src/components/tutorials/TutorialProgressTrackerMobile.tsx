import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { cn } from '@site/src/lib/utils'
import RadialProgress from './RadialProgress'

interface Section {
  id: string
  title: string
  level: number
  element: HTMLElement
  isVisible: boolean
  isCompleted: boolean
}

interface TutorialProgressTrackerMobileProps {
  className?: string
  meta?: any
  steps?: any[]
  activeStep?: any
  setActiveStep?: (step: any) => void
}

export const TutorialProgressTrackerMobile: React.FC<TutorialProgressTrackerMobileProps> = ({
  className,
  meta,
  steps = [],
  activeStep,
  setActiveStep
}) => {
  const [sections, setSections] = useState<Section[]>([])
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  // Extract headings from the page content
  useEffect(() => {
    const contentElement = document.querySelector('[role="main"] .markdown, [role="main"] .theme-doc-markdown, .tutorial-content')
    if (!contentElement) return

    const headingElements = contentElement.querySelectorAll('h1, h2, h3')
    const extractedSections: Section[] = Array.from(headingElements).map((heading, index) => {
      const element = heading as HTMLElement
      const level = parseInt(heading.tagName.charAt(1))

      return {
        id: heading.id || `section-${index}`,
        title: element.textContent || `Section ${index + 1}`,
        level,
        element,
        isVisible: false,
        isCompleted: false
      }
    })

    setSections(extractedSections)
  }, [])

  // Intersection Observer for section visibility
  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        setSections(prevSections => {
          const newSections = [...prevSections]

          entries.forEach(entry => {
            const sectionIndex = newSections.findIndex(
              section => section.element === entry.target
            )

            if (sectionIndex !== -1) {
              newSections[sectionIndex] = {
                ...newSections[sectionIndex],
                isVisible: entry.isIntersecting
              }
            }
          })

          const visibleSectionIndex = newSections.findIndex(section => section.isVisible)
          if (visibleSectionIndex !== -1) {
            setCurrentSectionIndex(visibleSectionIndex)

            for (let i = 0; i < visibleSectionIndex; i++) {
              newSections[i].isCompleted = true
            }
          }

          return newSections
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
      }
    )

    sections.forEach(section => {
      observer.observe(section.element)
    })

    return () => observer.disconnect()
  }, [sections])

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

  const navigateToSection = (section: Section) => {
    section.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
    setIsExpanded(false)
  }

  const getCurrentSectionProgress = () => {
    if (sections.length === 0) return 0
    return ((currentSectionIndex + 1) / sections.length) * 100
  }

  const currentSection = sections[currentSectionIndex]
  const completedCount = sections.filter(s => s.isCompleted).length

  if (sections.length === 0) {
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Collapsed Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white border border-border rounded-lg shadow-sm p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {currentSection?.title || 'Tutorial Progress'}
              </p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {sections.length} sections completed
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-purple-600">
              {Math.round(getCurrentSectionProgress())}%
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${getCurrentSectionProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 bg-white border border-border rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                Tutorial Progress
              </div>
              <div className="text-sm text-slate-300">
                {Math.round(scrollProgress)}% scrolled
              </div>
            </div>
            <h4 className="font-semibold">Reading Progress</h4>
          </div>

          {/* Sections List */}
          <div className="max-h-64 overflow-y-auto">
            {sections.map((section, index) => {
              const isActive = index === currentSectionIndex
              const isCompleted = section.isCompleted
              const isFuture = !isActive && !isCompleted

              return (
                <div
                  key={section.id}
                  onClick={() => navigateToSection(section)}
                  className={cn(
                    "flex items-center p-3 cursor-pointer transition-colors",
                    "border-b border-border last:border-b-0",
                    "hover:bg-accent/50",
                    isActive && "bg-purple-50",
                    isCompleted && "bg-green-50/30"
                  )}
                >
                  {/* Status Icon with Radial Progress */}
                  <div className="flex-shrink-0 mr-3">
                    <RadialProgress
                      progress={isCompleted ? 100 : (isActive ? scrollProgress : 0)}
                      size={24}
                      strokeWidth={2}
                      className={cn(
                        isCompleted && "text-green-500",
                        isActive && "text-purple-500",
                        isFuture && "text-muted"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-medium",
                        isCompleted && "text-green-600",
                        isActive && "text-purple-600",
                        isFuture && "text-muted-foreground"
                      )}>
                        {index + 1}
                      </span>
                    </RadialProgress>
                  </div>

                  {/* Section Title */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isActive && "text-purple-700",
                      isCompleted && "text-green-700",
                      isFuture && "text-muted-foreground"
                    )}>
                      {section.title}
                    </p>
                    {section.level > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {section.level === 2 ? "Section" : "Subsection"}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TutorialProgressTrackerMobile