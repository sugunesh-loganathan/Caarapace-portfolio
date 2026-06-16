"use client";

import { motion, type Variants } from "framer-motion";

interface LogoMarkProps {
  className?: string;
  animate?: boolean;
  /** Trigger the draw-in when scrolled into view instead of on mount. */
  inView?: boolean;
  delay?: number;
  color?: string;
}

const EASE = [0.65, 0, 0.35, 1] as const;

function pathVariants(index: number, delay: number): Variants {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, delay: delay + index * 0.16, ease: EASE },
        opacity: { duration: 0.3, delay: delay + index * 0.16 },
      },
    },
  };
}

/**
 * Abstract emblem: a hexagonal carapace/shell plate with banded ridge lines,
 * evoking a protective exoskeleton — the brand's namesake.
 */
export function LogoMark({
  className = "h-12 w-12",
  animate = true,
  inView = false,
  delay = 0,
  color = "#B30B3F",
}: LogoMarkProps) {
  const initial = animate ? "hidden" : undefined;
  const viewProps = inView
    ? { whileInView: "visible", viewport: { once: true, amount: 0.6 } }
    : { animate: animate ? "visible" : undefined };

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d="M50,6 L88.4,28 L88.4,72 L50,94 L11.6,72 L11.6,28 Z"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        initial={initial}
        {...viewProps}
        variants={pathVariants(0, delay)}
      />
      <motion.path
        d="M50,13 L50,87"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={initial}
        {...viewProps}
        variants={pathVariants(1, delay)}
      />
      <motion.path
        d="M19,29 Q50,37 81,29"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={initial}
        {...viewProps}
        variants={pathVariants(2, delay)}
      />
      <motion.path
        d="M14,50 Q50,59 86,50"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={initial}
        {...viewProps}
        variants={pathVariants(3, delay)}
      />
      <motion.path
        d="M19,71 Q50,63 81,71"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={initial}
        {...viewProps}
        variants={pathVariants(4, delay)}
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  animate?: boolean;
  delay?: number;
  color?: string;
}

export function Logo({
  className = "",
  markClassName = "h-9 w-9",
  textClassName = "text-xl",
  animate = true,
  delay = 0,
  color = "#B30B3F",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markClassName} animate={animate} delay={delay} color={color} />
      <span
        className={`font-heading font-extrabold tracking-[0.2em] text-charcoal ${textClassName}`}
      >
        CAARAPACE
      </span>
    </div>
  );
}
