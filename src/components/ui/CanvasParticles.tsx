'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

interface Particle {
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

interface CanvasParticlesProps {
  isHovered: boolean
  onClick: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export default function CanvasParticles({ isHovered, onClick, containerRef }: CanvasParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const clickImpulseRef = useRef<number>(0)
  const [particles, setParticles] = useState<Particle[]>([])

  const primaryColorRef = useRef<string>('')
  const GRAVITY = 0.2
  const FRICTION = 0.97
  const BOUNCE_DAMPING = 0.95
  const MOUSE_FORCE = 18
  const TRAIL_LENGTH = isHovered ? 6 : 0
  const TARGET_FPS = 30
  const FRAME_INTERVAL_MS = 1000 / TARGET_FPS

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      setSize({ width: Math.max(1, Math.floor(rect.width)), height: Math.max(1, Math.floor(rect.height)) })
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])

  // Init particles when size available
  const initializeParticles = useCallback(() => {
    if (!size.width || !size.height) return [] as Particle[]
    const count = isHovered ? 10 : 8
    return Array.from({ length: count }, () => ({
      x: Math.random() * (size.width - 40) + 20,
      y: Math.random() * (size.height - 40) + 20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 3 + 2.5,
      mass: Math.random() * 2 + 1,
      opacity: 0.2 + Math.random() * 0.35,
      color: primaryColorRef.current || '#6638B8',
      trail: [],
    }))
  }, [size, isHovered])

  useEffect(() => {
    setParticles(initializeParticles())
  }, [initializeParticles])

  // Resolve theme primary color from CSS variables
  useEffect(() => {
    const resolvePrimary = () => {
      const host = containerRef.current ?? document.documentElement
      const raw = getComputedStyle(host).getPropertyValue('--primary').trim()
      const color = raw ? `hsl(${raw})` : '#6638B8'
      primaryColorRef.current = color
      // Update existing particles' color
      setParticles(prev => prev.map(p => ({ ...p, color })))
    }
    resolvePrimary()
  }, [containerRef, isHovered])

  // Mouse position local to canvas
  const mousePosRef = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    if (isHovered) document.addEventListener('mousemove', handleMove)
    return () => document.removeEventListener('mousemove', handleMove)
  }, [isHovered, containerRef])

  // Clear click pulse
  useEffect(() => {
    if (onClick) clickImpulseRef.current = 0
  }, [onClick])

  // Physics step
  const step = useCallback((dt: number) => {
    setParticles(prev => {
      const next = prev.map(p => {
        let { x, y, vx, vy } = p

        if (isHovered) {
          vy += GRAVITY * dt
          const dx = x - mousePosRef.current.x
          const dy = y - mousePosRef.current.y
          const dist = Math.hypot(dx, dy)
          if (dist > 0 && dist < 100) {
            const force = MOUSE_FORCE / (dist * dist)
            vx += (dx / dist) * force * dt
            vy += (dy / dist) * force * dt
          }
        }

        if (clickImpulseRef.current > 0.001) {
          const cx = size.width / 2
          const cy = size.height / 2
          const dx = x - cx
          const dy = y - cy
          const dist = Math.hypot(dx, dy)
          if (dist > 0) {
            const nx = dx / dist
            const ny = dy / dist
            const base = 50
            const f = base * clickImpulseRef.current
            vx += nx * f * dt
            vy += ny * f * dt
          }
          clickImpulseRef.current *= 0.9
        }

        if (isHovered && Math.random() < 0.02) {
          vx += (Math.random() - 0.5) * 0.25
          vy += (Math.random() - 0.5) * 0.25
        }

        vx *= FRICTION
        vy *= FRICTION

        if (isHovered) {
          x += vx * dt * 60
          y += vy * dt * 60
        }

        if (x - p.radius < 0) { x = p.radius; vx = -vx * BOUNCE_DAMPING }
        else if (x + p.radius > size.width) { x = size.width - p.radius; vx = -vx * BOUNCE_DAMPING }
        if (y - p.radius < 0) { y = p.radius; vy = -vy * BOUNCE_DAMPING }
        else if (y + p.radius > size.height) { y = size.height - p.radius; vy = -vy * BOUNCE_DAMPING }

        const trail = TRAIL_LENGTH > 0 ? (() => {
          const t = [...p.trail]
          t.unshift({ x, y, opacity: p.opacity * 0.6 })
          if (t.length > TRAIL_LENGTH) t.pop()
          return t
        })() : []

        return { ...p, x, y, vx, vy, trail }
      })
      return next
    })
  }, [isHovered, size.width, size.height, GRAVITY, MOUSE_FORCE, FRICTION, BOUNCE_DAMPING, TRAIL_LENGTH])

  // Draw
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      if (isHovered && TRAIL_LENGTH > 0) {
        for (let i = 0; i < p.trail.length; i++) {
          const t = p.trail[i]
          ctx.beginPath()
          ctx.arc(t.x, t.y, 1, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}`
          ctx.globalAlpha = Math.max(0, Math.min(1, t.opacity * (1 - i / (TRAIL_LENGTH || 1))))
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity
      ctx.shadowColor = p.color
      ctx.shadowBlur = p.radius * 2
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }
  }, [particles, isHovered, TRAIL_LENGTH])

  // RAF loop (throttled)
  useEffect(() => {
    if (!size.width || !size.height) return
    const run = (ts: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts
      const elapsed = ts - lastTimeRef.current
      if (elapsed >= FRAME_INTERVAL_MS) {
        const dt = Math.min(elapsed / 1000, 0.05)
        lastTimeRef.current = ts
        step(dt)
        draw()
      }
      animationRef.current = requestAnimationFrame(run)
    }
    animationRef.current = requestAnimationFrame(run)
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [size.width, size.height, FRAME_INTERVAL_MS, step, draw])

  // Sync canvas size to layout size and device pixel ratio
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.max(1, Math.floor(size.width * dpr))
    canvas.height = Math.max(1, Math.floor(size.height * dpr))
    canvas.style.width = `${size.width}px`
    canvas.style.height = `${size.height}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [size.width, size.height])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  )
}


