import React, { FC, useEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { grey } from '@mui/material/colors'
import { useHistory } from '@docusaurus/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

import { Step } from './models'
import { waitFor } from './utils'
import { GreenFontAwesomeIcon } from './TutorialList/styledComponents'

const ListIcon: FC<{ selfPosition: number; activePosition?: number }> = ({
  selfPosition,
  activePosition,
}) => {
  const theme = useTheme()
  const transform = { transform: 'translateY(-1px)' }

  // This gives the error:
  // "Property 'palette' does not exist on type 'Theme'.ts(2339)
  //
  // Palette _does_ in fact exist on `theme`
  // @ts-ignore
  const color = theme.palette.primary.main

  if (!activePosition) {
    return <FontAwesomeIcon size="lg" icon={faCircle} />
  }

  if (selfPosition === activePosition) {
    return (
      <FontAwesomeIcon
        icon={faCircle}
        size="lg"
        style={{ color, ...transform }}
      />
    )
  } else if (selfPosition < activePosition) {
    return (
      <GreenFontAwesomeIcon icon={faCheckCircle} size="lg" style={transform} />
    )
  } else {
    return <FontAwesomeIcon size="lg" icon={faCircle} style={transform} />
  }
}

const Steps: FC<{
  steps: Step[]
  activeStep: Step | null
  setActiveStep: (step: Step) => void
}> = ({ steps, activeStep, setActiveStep }) => {
  const history = useHistory()
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    // The last updated date will always render at the bottom of the page, there's no option
    // to change where it shows.
    //
    // As we want it to show under the steps list, we find the element and copy the text content,
    // rendering it in our own component.
    async function lastUpdated() {
      const elem = await waitFor('.theme-last-updated')
      setLastUpdated(elem.children[0].textContent || '')
    }
    lastUpdated()
  }, [])

  return (
    <Paper sx={{ height: 'fit-content' }}>
      <Box sx={{ paddingX: 2, paddingY: 1 }}>
        <List dense>
          {steps.map((step, i) => (
            <ListItem
              key={step.position}
              onClick={() => {
                history.push(step.path)
                setActiveStep(step)
              }}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                marginY: 1,
                backgroundColor:
                  activeStep?.position === step.position
                    ? grey[200]
                    : 'var(--mui-palette-background-paper)',
                color:
                  activeStep?.position === step.position
                    ? 'primary.main'
                    : 'var(--mui-palette-text-primary)',
              }}
            >
              <ListItemIcon
                sx={{ minWidth: '30px' /* Move the text closer to the icon */ }}
              >
                <ListIcon
                  selfPosition={step.position}
                  activePosition={activeStep?.position}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight:
                      step.position < activeStep?.position ? 'bold' : 'normal',
                  }}
                >
                  {step.sidebar_label || step.title}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Box sx={{ pl: 2, mb: 1 }}>
          <Typography variant="body2">
            <Grid container columnGap={'4px'}>
              <Typography variant="body2">Last updated on </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {lastUpdated}
              </Typography>
            </Grid>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default Steps
