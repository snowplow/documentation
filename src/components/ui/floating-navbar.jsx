"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export const FloatingNav = ({ navItems, className, showBadge = false }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious();
      if (previous !== null && previous !== undefined) {
        let direction = current - previous;

        // Always show near the top; otherwise show on scroll up, hide on scroll down
        if (scrollYProgress.get() < 0.02) {
          setVisible(true);
        } else {
          setVisible(direction < 0);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-border rounded-full bg-background/95 backdrop-blur-sm shadow-lg z-[5000] px-4 py-2 items-center justify-center space-x-2",
          className
        )}
      >
        {showBadge && (
          <div className="inline-flex items-center gap-1 pl-1 pr-20">
            <img src="/img/snowplow-logo.svg" alt="Snowplow" className="h-6 fill-primary" />
            <span className="text-sm font-medium text-foreground">
              Developer Docs
            </span>
          </div>
        )}
        {navItems.map((navItem, idx) => (
          navItem.onClick ? (
            <Button
              key={`link=${idx}`}
              variant={navItem.isPrimary ? "default" : "ghost"}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                navItem.onClick();
              }}
              className={cn(
                "flex items-center space-x-1 text-muted-foreground hover:text-muted-foreground no-underline hover:no-underline",
                navItem.isPrimary && "rounded-full text-primary-foreground hover:text-primary-foreground"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Button>
          ) : (
            <Button
              key={`link=${idx}`}
              variant={navItem.isPrimary ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <a href={navItem.link} className={cn(
                "flex items-center space-x-1 text-muted-foreground hover:text-muted-foreground no-underline hover:no-underline",
                navItem.isPrimary && "rounded-full text-primary-foreground hover:text-primary-foreground"
              )}>
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-sm">{navItem.name}</span>
              </a>
            </Button>
          )
        ))}
      </motion.div>
    </AnimatePresence>
  );
};