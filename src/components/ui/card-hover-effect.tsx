"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@site/src/lib/utils";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    id: string;
    content: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 xl:gap-1",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block p-2 w-full"
          style={{ height: "100%" }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-muted-foreground/40 block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.30,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="relative z-20">
            {item.content}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl h-full w-full overflow-hidden bg-transparent border-transparent group-hover:border-slate-700 relative z-20 flex flex-col",
        className
      )}
    >
      <div className="relative z-50 flex-1 flex flex-col">
        <div className="h-full flex flex-col">{children}</div>
      </div>
    </div>
  );
};