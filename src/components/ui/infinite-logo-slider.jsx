'use client';

import React from 'react';
import { cn } from '../../lib/utils';

const LOGOS = [
    { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI Logo", height: 24 },
    { src: "https://html.tailus.io/blocks/customers/nvidia.svg", alt: "Nvidia Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/column.svg", alt: "Column Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg", alt: "Lemon Squeezy Logo", height: 20 },
    { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel Logo", height: 16 },
    { src: "https://html.tailus.io/blocks/customers/lilly.svg", alt: "Lilly Logo", height: 28 },
];

const InfiniteSlider = ({
    children,
    speed = 25,
    direction = "left",
    className = ""
}) => {
    const logoContainerRef = React.useRef(null);
    const [containerWidth, setContainerWidth] = React.useState(0);

    React.useEffect(() => {
        if (logoContainerRef.current) {
            const width = logoContainerRef.current.scrollWidth;
            setContainerWidth(width);
        }
    }, [children]);

    React.useEffect(() => {
        if (containerWidth === 0) return;

        // Inject CSS animations into the document head
        const style = document.createElement('style');
        style.textContent = `
            @keyframes infinite-scroll-left-${containerWidth} {
                0% {
                    transform: translateX(0px);
                }
                100% {
                    transform: translateX(-${containerWidth}px);
                }
            }
            @keyframes infinite-scroll-right-${containerWidth} {
                0% {
                    transform: translateX(-${containerWidth}px);
                }
                100% {
                    transform: translateX(0px);
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, [containerWidth]);

    const animationName = direction === "left"
        ? `infinite-scroll-left-${containerWidth}`
        : `infinite-scroll-right-${containerWidth}`;

    return (
        <div className={cn("flex overflow-hidden relative w-full", className)}>
            {/* Fade overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: 'linear-gradient(to right, hsl(var(--card)) 0%, transparent 15%, transparent 85%, hsl(var(--card)) 100%)'
                }}
            />

            {/* Hidden container to measure width */}
            <div
                ref={logoContainerRef}
                className="flex items-center gap-16 opacity-0 absolute"
                style={{ pointerEvents: 'none' }}
            >
                {children}
            </div>

            {/* Actual animated container */}
            <div
                className="flex items-center"
                style={{
                    animation: containerWidth > 0 ? `${animationName} ${speed}s linear infinite` : 'none',
                    width: 'max-content'
                }}
            >
                <div className="flex items-center gap-16">
                    {children}
                </div>
                <div className="flex items-center gap-16 ml-16">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function LogoCloudDemo() {
    return (
        <section className="bg-background overflow-hidden py-16 w-full">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-border md:pr-6">
                        <p className="text-base text-muted-foreground font-medium">
                            Powering the best teams
                        </p>
                    </div>
                    <div className="w-full py-6 md:w-auto md:flex-1">
                        <InfiniteSlider speed={25}>
                            {LOGOS.map((logo, index) => (
                                <img
                                    key={index}
                                    className="h-auto w-fit opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0 dark:invert"
                                    src={logo.src}
                                    alt={logo.alt}
                                    style={{ height: `${logo.height}px` }}
                                    width="auto"
                                />
                            ))}
                        </InfiniteSlider>
                    </div>
                </div>
            </div>
        </section>
    );
}