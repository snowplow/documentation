'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import CanvasParticles from './CanvasParticles'
import { Button } from './button.tsx'

function Frame941() {
  return (
    <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start leading-[0] not-italic pb-4 pt-2 px-0 relative shrink-0 text-left w-full">
      <motion.div 
        className="flex flex-col  justify-center relative shrink-0 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="p-0 m-0 font-extrabold text-lg text-foreground text-pretty">Want to see a <span className="inline-block">custom demo?</span></h3>
      </motion.div>
      <motion.div 
        className="flex flex-col justify-center relative shrink-0  w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="font-normal text-base text-balance text-muted-foreground">
        Our technical experts <span className="inline-block">are here to help.</span>
        </p>
      </motion.div>
    </div>
  );
}

function AnimatedButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e?: React.MouseEvent) => {
    if (isLoading) {
      e?.preventDefault();
      return;
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Here you would typically handle the actual demo booking
  }

  return (
    <motion.div
      className="relative w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Button
        asChild
        className="snowplow-button w-full h-11 flex items-center justify-center gap-2 text-base font-medium relative rounded-lg"
        disabled={isLoading}
      >
        <a
          href="https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          {isLoading && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            </motion.span>
          )}
          <motion.span
            animate={{ x: isLoading ? 8 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? 'Booking...' : 'Book a demo'}
          </motion.span>
        </a>
      </Button>
    </motion.div>
  )
}

// Animated background gradient
function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 rounded-lg"
      animate={{
        background: [
          "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--background)/0.95) 100%)",
          "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--background)/0.98) 100%)",
          "linear-gradient(135deg, hsl(var(--primary)/0.08) 0%, hsl(var(--background)/0.95) 100%)",
        ],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

export default function InteractiveBanner() {
  const [isHovered, setIsHovered] = useState(false)
  const [clickEffect, setClickEffect] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isPageVisible, setIsPageVisible] = useState(true)

  const handleClick = () => {
    setClickEffect(true)
    setTimeout(() => setClickEffect(false), 1200)
  }

  // Observe banner visibility in viewport
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsVisible(entry.isIntersecting)
      },
      { root: null, threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Page/tab visibility
  useEffect(() => {
    const handleVisibility = () => setIsPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    handleVisibility()
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const shouldRenderParticles = isHovered && isVisible && isPageVisible

  return (
    <motion.div
      ref={containerRef}
      className="relative rounded-lg size-full overflow-hidden cursor-pointer"
      data-name="Book a demo"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        boxShadow: "0 20px 40px rgba(102, 56, 184, 0.15)" 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Canvas-based particles to minimize DOM mutations */}
      {shouldRenderParticles && (
        <CanvasParticles 
          isHovered={isHovered}
          onClick={clickEffect} 
          containerRef={containerRef}
        />
      )}
      
      {/* Border */}
      <div
        aria-hidden="true"
        className="absolute border border-border border-solid inset-0 pointer-events-none rounded-lg"
      />
      
      {/* Content */}
      <div className="relative size-full z-10 pointer-events-none">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-6 py-8 relative size-full">
          <Frame941 />
          <div className="pointer-events-auto">
            <AnimatedButton />
          </div>
        </div>
      </div>

      {/* Hover glow effect with primary color */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(102, 56, 184, 0.1) 0%, transparent 70%)",
        }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}