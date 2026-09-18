import type { MotionProps } from 'motion/react'
import type { CSSProperties, ElementType, JSX } from 'react'
import { memo, useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@site/src/lib/utils.js'

type MotionHTMLProps = MotionProps & Record<string, unknown>

const motionComponentCache = new Map<
  keyof JSX.IntrinsicElements,
  React.ComponentType<MotionHTMLProps>
>()

const getMotionComponent = (element: keyof JSX.IntrinsicElements) => {
  let component = motionComponentCache.get(element)
  if (!component) {
    component = motion.create(element)
    motionComponentCache.set(element, component)
  }
  return component
}

export interface TextShimmerProps {
  children: string
  as?: ElementType
  className?: string
  duration?: number
  spread?: number
}

const ShimmerComponent = ({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const reducedMotion = useReducedMotion()
  const MotionComponent = getMotionComponent(
    Component as keyof JSX.IntrinsicElements
  )

  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread]
  )

  if (reducedMotion) {
    const Static = Component
    return (
      <Static className={cn('m-0 text-muted-foreground', className)}>
        {children}
      </Static>
    )
  }

  return (
    <MotionComponent
      animate={{ backgroundPosition: '0% center' }}
      className={cn(
        'relative m-0 inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),hsl(var(--background)),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage:
            'var(--bg), linear-gradient(hsl(var(--muted-foreground)), hsl(var(--muted-foreground)))',
        } as CSSProperties
      }
      transition={{
        duration,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      {children}
    </MotionComponent>
  )
}

export const Shimmer = memo(ShimmerComponent)
