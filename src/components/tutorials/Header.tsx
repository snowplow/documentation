import React from 'react'

import { Link } from 'react-router-dom'

import { Breadcrumbs, Grid, Typography } from '@mui/material'

import { Topic } from './TutorialList/styledComponents'

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
          <Typography variant="h4" sx={{ fontSize: '28px' }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Topic label={label} />
        </Grid>
      </Grid>
    </Grid>
  )
}
