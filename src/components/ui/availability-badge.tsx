import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const BADGE_LABELS: Record<string, string> = {
  cloud: 'Cloud',
  pmc: 'Private Managed Cloud',
  selfHosted: 'Self-Hosted',
  addon: 'Addon'
};

const availabilityBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all whitespace-nowrap",
  {
    variants: {
      variant: {
        active: "bg-primary text-primary-foreground shadow-sm",
        inactive: "bg-muted text-muted-foreground opacity-50"
      }
    },
    defaultVariants: {
      variant: "inactive"
    }
  }
);

type BadgeType = 'cloud' | 'pmc' | 'selfHosted' | 'addon';

export interface AvailabilityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof availabilityBadgeVariants> {
  type: BadgeType;
  active?: boolean;
  className?: string;
}

const AvailabilityBadge = React.forwardRef<HTMLSpanElement, AvailabilityBadgeProps>(
  ({ type, active = false, className, ...props }, ref) => {
    const variant = active ? "active" : "inactive";
    const label = BADGE_LABELS[type];
    const ariaLabel = `${label}: ${active ? 'Available' : 'Not available'}`;

    return (
      <span
        ref={ref}
        role="listitem"
        aria-label={ariaLabel}
        className={cn(availabilityBadgeVariants({ variant, className }))}
        {...props}
      >
        {label}
      </span>
    );
  }
);

AvailabilityBadge.displayName = "AvailabilityBadge";

export { AvailabilityBadge, availabilityBadgeVariants };
