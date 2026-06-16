"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}

/** Reveals each word sliding up out of a clipped mask. Ideal for scroll-triggered headlines. */
export function RevealWords({
  text,
  className = "",
  delay = 0,
  stagger = 0.07,
  once = true,
  amount = 0.6,
}: RevealWordsProps) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.28em] inline-block overflow-hidden pb-[0.08em] align-top last:mr-0"
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

interface RevealCharsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/** Reveals each character with a blur + rise. Fires immediately on mount — gate with conditional render. */
export function RevealChars({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
}: RevealCharsProps) {
  const chars = Array.from(text);
  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: delay + i * stagger, ease: EASE }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
