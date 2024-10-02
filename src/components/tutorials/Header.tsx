import React from 'react'

import { Link } from 'react-router-dom'

import { Breadcrumbs, Grid, Typography } from '@mui/material'

import { Topic, TutorialTitle } from './TutorialList/styledComponents'

export function Header({ title, label }: { title: string; label: string }) {
  return (
    <Grid container direction="column" rowSpacing={0}>
      <Grid item>
        <Breadcrumbs>
          <Link to="/tutorials">Tutorials & Guides</Link>
          <Typography>{title}</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item container alignItems="center" columnSpacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <TutorialTitle variant="h4">{title}</TutorialTitle>
        </Grid>
        <Grid item>
          <Topic label={label} />
        </Grid>
      </Grid>
    </Grid>
  )
}
