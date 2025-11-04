import React from 'react'

import { Box, Grid } from '@mui/material'
import PaginatorNavLink from '@theme/PaginatorNavLink'
import { Step } from '@site/src/components/tutorials/models'

export const Paginators: React.FC<{
  next: Step | null
  prev: Step | null
  setActiveStep: (step: Step) => void
  isMobile?: boolean
  className?: string
  currentStep?: Step | null
  tutorialId?: string
}> = ({ next, prev, setActiveStep, isMobile = false, className, currentStep, tutorialId }) => {

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
    <Box
      className={className}
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Grid
        justifyContent="space-between"
        direction="row"
        container
        spacing={isMobile ? 1 : 2}
      >
        <Grid item xs={prev ? 6 : 0}>
          {prev ? (
            <PaginatorNavLink
              onClick={() => setActiveStep(prev)}
              isNext={false}
              permalink={prev.path}
              title={prev.title}
              subLabel="Previous"
            />
          ) : (
            // Zero width element so space-between aligns right correctly if there is no previous
            <></>
          )}
        </Grid>

        {next && (
          <Grid item xs={prev ? 6 : 12}>
            <PaginatorNavLink
              onClick={() => handleNextClick(next)}
              isNext={true}
              permalink={next.path}
              title={next.title}
              subLabel="Next"
            />
          </Grid>
        )}
      </Grid>
      
    </Box>
  )
}
