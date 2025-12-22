"use client";
import React from "react";
import { cn } from "../../lib/utils";

export const BackgroundLines = ({
  children,
  className,
  svgOptions = {},
  ...props
}) => {
  return (
    <div className={cn("relative w-full h-full", className)} {...props}>
      <SVGBackground svgOptions={svgOptions} />
      {/* Soft gradient overlay to hide the center point */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 15%, transparent 30%)',
          zIndex: 2
        }}
      />
      {children}
    </div>
  );
};

const SVGBackground = ({ svgOptions = {} }) => {
  const { duration = 3 } = svgOptions;

  // Generate lines that animate from center outward
  const generatePaths = () => {
    const paths = [];
    const colors = ['#8b5cf6']; // violet-500 color

    for (let i = 0; i < 25; i++) {
      // Center point
      const centerX = 50;
      const centerY = 50;

      // Random direction
      const angle = Math.random() * 360;

      // Start distance from center (to avoid showing the center point)
      const startDistance = Math.random() * 8 + 12; // 12-20 units from center
      const segmentLength = Math.random() * 40 + 30; // 30-70 units long to reach edges
      const endDistance = startDistance + segmentLength;

      // Calculate start and end positions
      const startX = centerX + Math.cos(angle * Math.PI / 180) * startDistance;
      const startY = centerY + Math.sin(angle * Math.PI / 180) * startDistance;
      const endX = centerX + Math.cos(angle * Math.PI / 180) * endDistance;
      const endY = centerY + Math.sin(angle * Math.PI / 180) * endDistance;

      // Create squiggly path with midpoint
      const midDistance = startDistance + (segmentLength * 0.5);
      const midX = centerX + Math.cos(angle * Math.PI / 180) * midDistance + (Math.random() - 0.5) * 3;
      const midY = centerY + Math.sin(angle * Math.PI / 180) * midDistance + (Math.random() - 0.5) * 3;

      const color = colors[Math.floor(Math.random() * colors.length)];
      const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

      paths.push({
        d: pathData,
        color,
        delay: Math.random() * 4,
        duration: Math.random() * 1.5 + duration,
      });
    }

    return paths;
  };

  const paths = generatePaths();

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 1 }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          stroke={path.color}
          strokeWidth="0.15"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="50"
          strokeDashoffset="50"
        >
          {/* Animate the line drawing from center outward */}
          <animate
            attributeName="stroke-dashoffset"
            values="50;-50"
            dur={`${path.duration}s`}
            repeatCount="indefinite"
            begin={`${path.delay}s`}
          />
          {/* Fade in at start, fade out at end */}
          <animate
            attributeName="opacity"
            values="0;0.16;0.16;0"
            dur={`${path.duration}s`}
            repeatCount="indefinite"
            begin={`${path.delay}s`}
          />
        </path>
      ))}
    </svg>
  );
};