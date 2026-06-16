"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/ui/Logo";
import { RevealWords } from "@/components/ui/RevealText";

const EASE = [0.16, 1, 0.3, 1] as const;

const ORBIT_LABELS = [
  { label: "ERP", angle: -90 },
  { label: "Smart CRM", angle: -18 },
  { label: "Web", angle: 54 },
  { label: "Industry Solutions", angle: 126 },
  { label: "Strategy", angle: 198 },
];

export default function Introducing({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-charcoal px-6 py-28"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.06]" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-[0.3em] text-crimson"
        >
          <span className="h-px w-6 bg-crimson" />
          Introducing Caarapace
        </motion.span>

        <h2 className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
          <RevealWords text="Technology Built Around Your Business." />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 font-body text-lg text-white/55"
        >
          We don&apos;t sell products. We build solutions.
        </motion.p>

        <div className="relative mt-20 flex h-[420px] w-[420px] items-center justify-center sm:h-[520px] sm:w-[520px]">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-crimson/25"
              style={{
                width: `${ring * 33}%`,
                height: `${ring * 33}%`,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: [0, 0.6, 0.3], scale: [0.7, 1, 1] }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.6, delay: ring * 0.25, ease: EASE }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_0_60px_rgba(179,11,63,0.35)] sm:h-28 sm:w-28"
          >
            <LogoMark className="h-14 w-14 sm:h-16 sm:w-16" inView delay={0.2} />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {ORBIT_LABELS.map((o, i) => {
              const rad = (o.angle * Math.PI) / 180;
              const radius = 50;
              const x = 50 + radius * Math.cos(rad);
              const y = 50 + radius * Math.sin(rad);
              return (
                <motion.div
                  key={o.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.12, ease: EASE }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                    className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 font-body text-xs font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm"
                  >
                    {o.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
