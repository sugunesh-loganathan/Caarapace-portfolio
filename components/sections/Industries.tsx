"use client";

import { motion } from "framer-motion";
import {
  HardHat,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Factory,
  Briefcase,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const INDUSTRIES = [
  { icon: HardHat, label: "Construction", angle: -90 },
  { icon: HeartPulse, label: "Healthcare", angle: -30 },
  { icon: GraduationCap, label: "Education", angle: 30 },
  { icon: ShoppingCart, label: "Retail", angle: 90 },
  { icon: Factory, label: "Manufacturing", angle: 150 },
  { icon: Briefcase, label: "Professional Services", angle: 210 },
];

function pos(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

export default function Industries({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative w-full overflow-hidden bg-white px-6 py-28 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Industries We Empower"
          title="One Platform Philosophy, Built For Every Sector."
          align="center"
          className="mx-auto mb-20 max-w-3xl"
        />

        <div className="relative mx-auto flex h-[560px] w-full max-w-2xl items-center justify-center sm:h-[660px]">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {INDUSTRIES.map((ind, i) => {
              const { x, y } = pos(ind.angle, 38);
              return (
                <motion.line
                  key={ind.label}
                  x1={50}
                  y1={50}
                  x2={x}
                  y2={y}
                  stroke="#B30B3F"
                  strokeOpacity={0.32}
                  strokeWidth={0.4}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                />
              );
            })}
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-charcoal shadow-xl sm:h-24 sm:w-24"
          >
            <LogoMark className="h-10 w-10 sm:h-12 sm:w-12" color="#FFFFFF" animate={false} />
          </motion.div>

          {INDUSTRIES.map((ind, i) => {
            const { x, y } = pos(ind.angle, 42);
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.label}
                className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: EASE }}
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-charcoal/10 bg-lightgray shadow-sm sm:h-20 sm:w-20"
                >
                  <Icon className="h-7 w-7 text-crimson sm:h-8 sm:w-8" strokeWidth={1.6} />
                </motion.div>
                <span className="max-w-[100px] text-center font-body text-xs font-medium text-charcoal/70 sm:text-sm">
                  {ind.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
