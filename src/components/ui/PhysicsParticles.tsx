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
  containerRef: React.RefObject<HTMLDivElement>
}

export default function PhysicsParticles({ isHovered, onClick, containerRef }: PhysicsParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollForce, setScrollForce] = useState({ direction: 0, intensity: 0 })
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const lastScrollY = useRef<number>(0)
  const scrollVelocity = useRef<number>(0)
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 })

  const PRIMARY_COLOR = 'hsl(var(--primary))'
  const GRAVITY = 0.25
  const FRICTION = 0.965
  const BOUNCE_DAMPING = 1
  const COLLISION_DAMPING = 0.8
  const MOUSE_FORCE = 25
  const SCROLL_FORCE_MULTIPLIER = 0.25
  const SCROLL_DECAY = 0.95
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

  // Scroll detection and force calculation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const deltaY = currentScrollY - lastScrollY.current
      
      // Calculate scroll velocity (pixels per frame)
      scrollVelocity.current = deltaY
      
      // Update scroll force based on direction and speed
      const intensity = Math.min(Math.abs(deltaY) * 0.5, 10) // Cap intensity
      const direction = deltaY > 0 ? 1 : -1 // 1 for down, -1 for up
      
      setScrollForce({
        direction,
        intensity
      })
      
      lastScrollY.current = currentScrollY
    }

    // Throttled scroll handler for better performance
    let ticking = false
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler)
    }
  }, [])

  // Decay scroll force over time
  useEffect(() => {
    if (scrollForce.intensity > 0) {
      const timer = setTimeout(() => {
        setScrollForce(prev => ({
          ...prev,
          intensity: prev.intensity * SCROLL_DECAY
        }))
      }, 16) // ~60fps
      
      return () => clearTimeout(timer)
    }
  }, [scrollForce.intensity])

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

        // Apply gravity
        vy += GRAVITY * deltaTime

        // Apply scroll-based forces
        if (scrollForce.intensity > 0.1) {
          // Scroll down = particles get pushed down and bounce up
          // Scroll up = particles get pushed up and bounce down
          const scrollVelocityForce = scrollForce.direction * scrollForce.intensity * SCROLL_FORCE_MULTIPLIER
          
          // Apply vertical force based on scroll direction
          vy += scrollVelocityForce * deltaTime
          
          // Add some horizontal randomness for more dynamic movement
          vx += (Math.random() - 0.5) * scrollForce.intensity * 2 * deltaTime
          
          // Create a "shake" effect by applying forces based on particle position
          const centerY = containerBounds.height / 2
          const distanceFromCenter = Math.abs(y - centerY) / centerY
          const positionBasedForce = (1 - distanceFromCenter) * scrollForce.intensity * 2
          
          if (scrollForce.direction > 0) {
            // Scrolling down - push particles down then they bounce back up
            vy += positionBasedForce * deltaTime
          } else {
            // Scrolling up - push particles up then they bounce back down
            vy -= positionBasedForce * deltaTime
          }
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

        // Click explosion effect
        if (onClick) {
          const centerX = containerBounds.width / 2
          const centerY = containerBounds.height / 2
          const explosionDistance = Math.sqrt(
            Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2)
          )
          
          if (explosionDistance > 0) {
            const explosionForce = 500
            const explosionNx = (x - centerX) / explosionDistance
            const explosionNy = (y - centerY) / explosionDistance
            
            vx += explosionNx * explosionForce * deltaTime
            vy += explosionNy * explosionForce * deltaTime
          }
        }

        // Add some random movement for continuous motion
        if (Math.random() < 0.03) {
          vx += (Math.random() - 0.5) * 0.3
          vy += (Math.random() - 0.5) * 0.3
        }

        // Apply friction
        vx *= FRICTION
        vy *= FRICTION

        // Update position
        x += vx * deltaTime * 60 // 60fps normalization
        y += vy * deltaTime * 60

        // Enhanced boundary collision detection with more energetic bouncing
        const bounceMultiplier = scrollForce.intensity > 0.5 ? 1.2 : 1.0 // More energetic bouncing during scroll
        
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
          // Add some extra energy when hitting top during scroll
          if (scrollForce.direction < 0 && scrollForce.intensity > 1) {
            vy += scrollForce.intensity * 2
          }
        } else if (y + particle.radius > containerBounds.height) {
          y = containerBounds.height - particle.radius
          vy = -vy * BOUNCE_DAMPING * bounceMultiplier
          // Add some extra energy when hitting bottom during scroll
          if (scrollForce.direction > 0 && scrollForce.intensity > 1) {
            vy -= scrollForce.intensity * 2
          }
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

      // Handle particle-to-particle collisions
      for (let i = 0; i < newParticles.length; i++) {
        for (let j = i + 1; j < newParticles.length; j++) {
          if (checkCollision(newParticles[i], newParticles[j])) {
            handleCollision(newParticles[i], newParticles[j])
          }
        }
      }

      return newParticles
    })
  }, [isHovered, onClick, mousePos, containerBounds, scrollForce, GRAVITY, FRICTION, BOUNCE_DAMPING, COLLISION_DAMPING, MOUSE_FORCE])

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [updatePhysics])

  // Reset particles on click
  useEffect(() => {
    if (onClick) {
      const timer = setTimeout(() => {
        setParticles(initializeParticles())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [onClick, initializeParticles])

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
              scale: isHovered ? [1, 1.2, 1] : 1,
              // Add subtle glow during scroll interaction
              boxShadow: scrollForce.intensity > 1 
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

      {/* Scroll intensity indicator (subtle visual feedback) */}
      {scrollForce.intensity > 0.5 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${PRIMARY_COLOR}05 0%, transparent 70%)`,
          }}
          animate={{
            opacity: Math.min(scrollForce.intensity / 5, 0.3),
          }}
          transition={{
            duration: 0.1,
          }}
        />
      )}
    </div>
  )
}