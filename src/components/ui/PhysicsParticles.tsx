'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  mass: number
  opacity: number
  color: string
  trail: Array<{ x: number; y: number; opacity: number }>
}

interface PhysicsParticlesProps {
  isHovered: boolean
  onClick: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export default function PhysicsParticles({ isHovered, onClick, containerRef }: PhysicsParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 })
  const clickImpulseRef = useRef<number>(0)

  const PRIMARY_COLOR = 'hsl(var(--primary))'
  const GRAVITY = 0.25
  const FRICTION = 0.965
  const BOUNCE_DAMPING = 1
  const COLLISION_DAMPING = 0.8
  const MOUSE_FORCE = 25
  const TRAIL_LENGTH = 8

  // Initialize particles
  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return []

    const rect = containerRef.current.getBoundingClientRect()
    setContainerBounds({ width: rect.width, height: rect.height })

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * (rect.width - 40) + 20,
      y: Math.random() * (rect.height - 40) + 20,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 4 + 3, // 3-7px radius
      mass: Math.random() * 2 + 1, // 1-3 mass
      opacity: 0.2 + Math.random() * 0.4, // 0.2-0.6 opacity
      color: PRIMARY_COLOR,
      trail: [],
    }))
  }, [containerRef, PRIMARY_COLOR])

  // Removed scroll-based movement

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    if (isHovered) {
      document.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovered, containerRef])

  // Initialize particles on mount
  useEffect(() => {
    setParticles(initializeParticles())
  }, [initializeParticles])

  // Collision detection between two particles
  const checkCollision = (p1: Particle, p2: Particle): boolean => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < p1.radius + p2.radius
  }

  // Handle collision response between two particles
  const handleCollision = (p1: Particle, p2: Particle) => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) return // Prevent division by zero

    // Normalize collision vector
    const nx = dx / distance
    const ny = dy / distance

    // Separate particles to prevent overlap
    const overlap = (p1.radius + p2.radius - distance) / 2
    p1.x += nx * overlap
    p1.y += ny * overlap
    p2.x -= nx * overlap
    p2.y -= ny * overlap

    // Calculate relative velocity
    const relativeVelocityX = p1.vx - p2.vx
    const relativeVelocityY = p1.vy - p2.vy

    // Calculate relative velocity along collision normal
    const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return

    // Calculate impulse scalar
    const impulse = (2 * velocityAlongNormal) / (p1.mass + p2.mass) * COLLISION_DAMPING

    // Apply impulse to velocities
    p1.vx -= impulse * p2.mass * nx
    p1.vy -= impulse * p2.mass * ny
    p2.vx += impulse * p1.mass * nx
    p2.vy += impulse * p1.mass * ny
  }

  // Update particle physics
  const updatePhysics = useCallback((deltaTime: number) => {
    setParticles(prevParticles => {
      const newParticles = prevParticles.map(particle => {
        let { x, y, vx, vy } = particle

        // No gravity or movement unless hovered
        if (isHovered) {
          vy += GRAVITY * deltaTime
        }

        // Mouse interaction (attraction/repulsion)
        if (isHovered) {
          const mouseDistance = Math.sqrt(
            Math.pow(mousePos.x - x, 2) + Math.pow(mousePos.y - y, 2)
          )
          
          if (mouseDistance < 100 && mouseDistance > 0) {
            const force = MOUSE_FORCE / (mouseDistance * mouseDistance)
            const mouseNx = (x - mousePos.x) / mouseDistance
            const mouseNy = (y - mousePos.y) / mouseDistance
            
            vx += mouseNx * force * deltaTime
            vy += mouseNy * force * deltaTime
          }
        }

        // Subtle click pulse effect (decaying outward nudge)
        if (clickImpulseRef.current > 0.001) {
          const centerX = containerBounds.width / 2
          const centerY = containerBounds.height / 2
          const distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2))

          if (distance > 0) {
            const nx = (x - centerX) / distance
            const ny = (y - centerY) / distance
            // Base force kept small; scales with the current impulse
            const baseForce = 60
            const force = baseForce * clickImpulseRef.current
            vx += nx * force * deltaTime
            vy += ny * force * deltaTime
          }

          // Decay the impulse each frame
          clickImpulseRef.current *= 0.9
        }

        // No random movement unless hovered
        if (isHovered && Math.random() < 0.03) {
          vx += (Math.random() - 0.5) * 0.3
          vy += (Math.random() - 0.5) * 0.3
        }

        // Apply friction
        vx *= FRICTION
        vy *= FRICTION

        // Update position only when hovered
        if (isHovered) {
          x += vx * deltaTime * 60 // 60fps normalization
          y += vy * deltaTime * 60
        }

        // Enhanced boundary collision detection with more energetic bouncing
        const bounceMultiplier = 1.0
        
        if (x - particle.radius < 0) {
          x = particle.radius
          vx = -vx * BOUNCE_DAMPING * bounceMultiplier
        } else if (x + particle.radius > containerBounds.width) {
          x = containerBounds.width - particle.radius
          vx = -vx * BOUNCE_DAMPING * bounceMultiplier
        }

        if (y - particle.radius < 0) {
          y = particle.radius
          vy = -vy * BOUNCE_DAMPING * bounceMultiplier
        } else if (y + particle.radius > containerBounds.height) {
          y = containerBounds.height - particle.radius
          vy = -vy * BOUNCE_DAMPING * bounceMultiplier
        }

        // Update trail
        const newTrail = [...particle.trail]
        newTrail.unshift({ 
          x, 
          y, 
          opacity: particle.opacity * 0.6 
        })
        if (newTrail.length > TRAIL_LENGTH) {
          newTrail.pop()
        }

        return {
          ...particle,
          x,
          y,
          vx,
          vy,
          trail: newTrail,
        }
      })

      // Handle collisions only during hover for calmer idle state
      if (isHovered) {
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            if (checkCollision(newParticles[i], newParticles[j])) {
              handleCollision(newParticles[i], newParticles[j])
            }
          }
        }
      }

      return newParticles
    })
  }, [isHovered, onClick, mousePos, containerBounds, GRAVITY, FRICTION, BOUNCE_DAMPING, COLLISION_DAMPING, MOUSE_FORCE])

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000 // Convert to seconds
      lastTimeRef.current = currentTime

      if (deltaTime < 0.05) { // Cap delta time to prevent large jumps
        updatePhysics(deltaTime)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    }
  }, [updatePhysics])

  // Remove click pulse to keep idle calm
  useEffect(() => {
    if (onClick) {
      clickImpulseRef.current = 0
    }
  }, [onClick])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div key={particle.id}>
          {/* Particle trail */}
          {particle.trail.map((trailPoint, index) => (
            <div
              key={`${particle.id}-trail-${index}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: trailPoint.x - 1,
                top: trailPoint.y - 1,
                width: 2,
                height: 2,
                backgroundColor: particle.color,
                opacity: trailPoint.opacity * (1 - index / TRAIL_LENGTH),
                boxShadow: `0 0 4px ${particle.color}30`,
              }}
            />
          ))}
          
          {/* Main particle */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x - particle.radius,
              top: particle.y - particle.radius,
              width: particle.radius * 2,
              height: particle.radius * 2,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.radius * 4}px ${particle.color}40`,
            }}
            animate={{
              scale: isHovered ? [1, 1.1, 1] : 1,
              boxShadow: isHovered
                ? `0 0 ${particle.radius * 6}px ${particle.color}60`
                : `0 0 ${particle.radius * 4}px ${particle.color}40`,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        </div>
      ))}

      {/* Removed scroll intensity indicator */}
    </div>
  )
}