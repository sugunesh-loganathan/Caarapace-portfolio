"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { RevealWords } from "@/components/ui/RevealText";
import Particles from "@/components/ui/Particles";
import Magnetic from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;
const CONTACT_EMAIL = "info@caarapace.com";

export default function Finale({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-charcoal px-6 py-28"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.05]" aria-hidden="true" />
      <Particles className="opacity-40" count={50} color="176, 11, 63" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8"
        >
          <LogoMark className="h-16 w-16" inView delay={0.15} />
        </motion.div>

        <h2 className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
          <RevealWords text="Let's Build The Future Together." />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-6 max-w-md font-body text-base text-white/55 sm:text-lg"
        >
          Your strategic technology partner, ready to engineer what&apos;s next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-12"
        >
          <Magnetic>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-crimson px-9 py-4 font-body text-sm font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              Start Your Transformation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
        </motion.div>

        <motion.a
          href={`mailto:${CONTACT_EMAIL}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex items-center gap-2 font-body text-sm text-white/50 transition-colors duration-300 hover:text-white"
        >
          <Mail className="h-4 w-4" strokeWidth={1.75} />
          {CONTACT_EMAIL}
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 flex items-center gap-3"
        >
          <span className="h-px w-6 bg-white/20" />
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
            Caarapace
          </span>
          <span className="h-px w-6 bg-white/20" />
        </motion.div>
      </div>
    </section>
  );
}
