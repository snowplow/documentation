import React from 'react'

import { Link } from 'react-router-dom'

import { Grid } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { Topic, TutorialTitle } from './TutorialList/styledComponents'

export function Header({ title, label }: { title: string; label: string }) {
  return (
    <Grid container direction="column" rowSpacing={0}>
      <Grid item>
        <Link
          to="/tutorials"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeftIcon />
          Tutorials
        </Link>
      </Grid>
      <Grid item container alignItems="center" columnSpacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <TutorialTitle className="tutorial-title" variant="h4">
            {title}
          </TutorialTitle>
        </Grid>
        <Grid item>
          <Topic label={label} />
        </Grid>
      </Grid>
    </Grid>
  )
}
