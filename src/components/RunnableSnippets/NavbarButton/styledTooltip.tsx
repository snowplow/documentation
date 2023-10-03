import React from 'react'
import styled from '@emotion/styled'
import { TooltipProps, Tooltip, tooltipClasses } from '@mui/material'

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  // Make the tooltip arrow bigger, theme and position appropriately
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--mui-palette-background-paper)',
    width: '3em',
    height: '2em',
    transform: 'translate3d(92.5px, -14px, 0px) !important',
  },
  // Add a border to the tooltip arrow
  [`& .${tooltipClasses.arrow}::before`]: {
    // Taken from `.MuiTooltip-tooltip` border
    border: '1px solid #dadde9;',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--mui-palette-background-paper)',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    border: '1px solid #dadde9',
    marginTop: '20px !important',
  },
}))
