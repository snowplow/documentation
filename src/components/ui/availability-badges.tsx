import React from 'react'
import { AvailabilityBadge } from './availability-badge'
import { cn } from '../../lib/utils.js'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import HelpOutline from '@mui/icons-material/HelpOutline'

type BadgeType = 'cloud' | 'pmc' | 'selfHosted' | 'addon'

const ALL_BADGE_TYPES: BadgeType[] = ['cloud', 'pmc', 'selfHosted', 'addon']

const COMMON_HELP_TEXT = (
  <>
    Read more about{' '}
    <a href="/docs/get-started/" className="text-primary hover:underline">
      Snowplow CDI platforms
    </a>
    , or contact{' '}
    <a
      href="https://support.snowplow.io"
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      Support
    </a>
    .
  </>
)

export interface AvailabilityBadgesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  available: BadgeType[]
  helpContent?: string
  className?: string
}

const AvailabilityBadges = React.forwardRef<
  HTMLDivElement,
  AvailabilityBadgesProps
>(({ available, helpContent, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="list"
      aria-label="Product availability"
      className={cn('flex flex-wrap items-center gap-2 mt-0 mb-8', className)}
      {...props}
    >
      {ALL_BADGE_TYPES.map((type) => (
        <AvailabilityBadge
          key={type}
          type={type}
          active={available.includes(type)}
        />
      ))}

      {helpContent && (
        <Popover>
          <PopoverTrigger asChild>
            <HelpOutline
              className="text-muted-foreground hover:text-primary transition-colors ml-1 cursor-pointer"
              fontSize="inherit"
              aria-label="Help information about availability"
              role="button"
              tabIndex={0}
            />
          </PopoverTrigger>
          <PopoverContent align="start" side="bottom">
            <div className="space-y-2">
              <p className="text-sm">{helpContent}</p>
              <p className="text-xs text-muted-foreground">
                {COMMON_HELP_TEXT}
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
})

AvailabilityBadges.displayName = 'AvailabilityBadges'

export default AvailabilityBadges
