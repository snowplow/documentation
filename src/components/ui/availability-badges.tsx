import React from "react";
import { AvailabilityBadge } from "./availability-badge";
import { cn } from "../../lib/utils.js";

type BadgeType = 'cloud' | 'pmc' | 'selfHosted' | 'addon';

const ALL_BADGE_TYPES: BadgeType[] = ['cloud', 'pmc', 'selfHosted', 'addon'];

export interface AvailabilityBadgesProps extends React.HTMLAttributes<HTMLDivElement> {
  available: BadgeType[];
  className?: string;
}

const AvailabilityBadges = React.forwardRef<HTMLDivElement, AvailabilityBadgesProps>(
  ({ available, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="list"
        aria-label="Product availability"
        className={cn("flex flex-wrap items-center gap-2 mt-0 mb-4", className)}
        {...props}
      >
        {ALL_BADGE_TYPES.map((type) => (
          <AvailabilityBadge
            key={type}
            type={type}
            active={available.includes(type)}
          />
        ))}
      </div>
    );
  }
);

AvailabilityBadges.displayName = "AvailabilityBadges";

export default AvailabilityBadges;
