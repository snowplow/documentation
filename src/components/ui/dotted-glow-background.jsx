"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export const DottedGlowBackground = ({
  className,
  opacity = 1,
  gap = 10,
  radius = 1.6,
  colorLightVar = "--color-neutral-500",
  glowColorLightVar = "--color-neutral-600",
  colorDarkVar = "--color-neutral-500",
  glowColorDarkVar = "--color-sky-800",
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 1.6,
  speedScale = 1,
  ...props
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const dots = [];
    const numDots = Math.floor((canvas.width / window.devicePixelRatio) / gap) * Math.floor((canvas.height / window.devicePixelRatio) / gap);

    for (let i = 0; i < numDots; i++) {
      const x = (i % Math.floor((canvas.width / window.devicePixelRatio) / gap)) * gap + gap / 2;
      const y = Math.floor(i / Math.floor((canvas.width / window.devicePixelRatio) / gap)) * gap + gap / 2;

      dots.push({
        x,
        y,
        baseRadius: radius,
        currentRadius: radius,
        glowRadius: 0,
        phase: Math.random() * Math.PI * 2,
        speed: speedMin + Math.random() * (speedMax - speedMin),
      });
    }

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      dots.forEach((dot) => {
        const pulse = Math.sin(time * 0.001 * dot.speed * speedScale + dot.phase);
        dot.currentRadius = dot.baseRadius + pulse * 0.5;
        dot.glowRadius = Math.max(0, pulse * 2);

        // Draw glow effect
        if (dot.glowRadius > 0) {
          const gradient = ctx.createRadialGradient(
            dot.x, dot.y, 0,
            dot.x, dot.y, dot.glowRadius * 3
          );
          gradient.addColorStop(0, `rgba(56, 189, 248, ${0.3 * opacity})`);
          gradient.addColorStop(1, "rgba(56, 189, 248, 0)");

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.glowRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw main dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(156, 163, 175, ${opacity * 0.6})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [opacity, gap, radius, speedMin, speedMax, speedScale]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0", className)}
      style={{
        opacity: backgroundOpacity,
      }}
      {...props}
    />
  );
};