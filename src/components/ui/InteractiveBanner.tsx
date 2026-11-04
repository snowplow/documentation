'use client'

import React from 'react'
import { motion } from 'motion/react'
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
        <h3 className="p-0 m-0 font-extrabold text-lg text-foreground [text-wrap:balance]">Try Snowplow Free&nbsp;for 14&nbsp;Days</h3>
      </motion.div>
      <motion.div 
        className="flex flex-col justify-center relative shrink-0  w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="font-normal text-base [text-wrap:pretty] text-muted-foreground">
          Collect behavioral data and act on it in real time. Design a schema, send an event, and fetch live context with the AI Assistant and MCP server.
        </p>
      </motion.div>
    </div>
  );
}

function AnimatedButton() {
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
        className="snowplow-button shimmer-button w-full h-11 flex items-center justify-center gap-2 text-base font-medium relative rounded-lg"
      >
        <a
          href="https://snowplow.io/get-started/sign-up"
          target="_blank"
          rel="noopener noreferrer"
        >
          Start Free Trial
        </a>
      </Button>
    </motion.div>
  )
}

function DemoLink() {
  return (
    <motion.p
      className="m-0 text-sm text-muted-foreground [text-wrap:pretty]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      Want to see a custom demo instead?{' '}
      <a
        href="https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-2 whitespace-nowrap"
      >
        Book a demo
      </a>
    </motion.p>
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
  return (
    <motion.div
      className="group relative rounded-lg size-full overflow-hidden"
      data-name="Free trial"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 20px 40px rgba(102, 56, 184, 0.15)"
      }}
    >
      {/* Subtle Tailwind-only gradient background */}
      <div
        className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,hsl(var(--primary)/0.18)_0%,hsl(var(--primary)/0.06)_35%,hsl(var(--background)/1)_100%)] bg-[length:300%_300%] animate-subtle-gradient"
      />
      
      {/* Particles removed for near-zero CPU usage */}
      
      {/* Border */}
      <div
        aria-hidden="true"
        className="absolute border border-border border-solid inset-0 pointer-events-none rounded-lg"
      />

      {/* Hover glow effect with primary color */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(102, 56, 184, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative size-full z-10 pointer-events-none">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start px-6 py-8 relative size-full">
          <Frame941 />
          <div className="pointer-events-auto">
            <AnimatedButton />
          </div>
          <div className="pointer-events-auto pt-1">
            <DemoLink />
          </div>
        </div>
      </div>
    </motion.div>
  );
}