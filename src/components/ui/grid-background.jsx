"use client";
import { cn } from "../../lib/utils";
import React from "react";

export const GridBackground = ({
  children,
  className,
  containerClassName,
  gridSize = "40px",
  gridColor = "#e4e4e7",
  darkGridColor = "#262626",
  maskRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center bg-transparent",
        containerClassName
      )}
      {...props}
    >
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          maskRadialGradient && "[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        )}
        style={{
          backgroundSize: `${gridSize} ${gridSize}`,
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`
        }}
      />

      {/* Content */}
      <div className={cn("relative z-20", className)}>
        {children}
      </div>
    </div>
  );
};