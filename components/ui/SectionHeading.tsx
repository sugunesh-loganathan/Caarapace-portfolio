"use client";

import { motion } from "framer-motion";
import { RevealWords } from "./RevealText";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  titleClassName?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  titleClassName = "",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-4 inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-[0.3em] text-crimson"
        >
          <span className="h-px w-6 bg-crimson" />
          {eyebrow}
        </motion.span>
      )}
      <h2
        className={`font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal text-balance sm:text-5xl lg:text-6xl ${titleClassName}`}
      >
        <RevealWords text={title} />
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-xl font-body text-lg text-charcoal/65"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
