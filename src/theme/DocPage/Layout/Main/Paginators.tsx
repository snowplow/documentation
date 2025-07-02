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
}> = ({ next, prev, setActiveStep, isMobile = false, className }) => {
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
        direction={isMobile ? 'column' : 'row'}
        container
        columnSpacing={2}
      >
        <Grid item xs={6}>
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
          <Grid item xs={6}>
            <PaginatorNavLink
              onClick={() => setActiveStep(next)}
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
