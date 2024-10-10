import React from 'react'

import { Button } from '@mui/material'
import { grey } from '@mui/material/colors'
interface PaginatorNavButtonProps {
  title: string
  subLabel?: string
  isNext: boolean
  onClick: () => void
}

export default function PaginatorNavButton(props: PaginatorNavButtonProps) {
  const { title, subLabel, isNext, onClick } = props
  const chevronLeft = isNext ? '' : '«'
  const chevronRight = isNext ? '»' : ''
  const textAlign = isNext ? 'right' : 'left'

  return (
    <Button
      variant="outlined"
      sx={{
        transition: 'none', // Don't shift button up on hover
        minWidth: '240px',
        textTransform: 'none',
        border: `2px solid ${grey[300]}`,
        borderRadius: 1,
      }}
      onClick={onClick}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '100%',
          textAlign,
          height: '100%',
          marginBottom: '0',
          marginTop: '0.25rem',
        }}
      >
        {subLabel && (
          <div style={{ width: '100%' }} className="pagination-nav__sublabel">
            {subLabel}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            textAlign,
          }}
        >
          <div className="pagination-nav__label" style={{ width: '100%' }}>
            {chevronLeft} {title} {chevronRight}
          </div>
        </div>
      </div>
    </Button>
  )
}
