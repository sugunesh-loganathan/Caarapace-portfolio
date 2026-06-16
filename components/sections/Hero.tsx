"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { RevealChars } from "@/components/ui/RevealText";
import Particles from "@/components/ui/Particles";
import Magnetic from "@/components/ui/Magnetic";
import { useScrollTo } from "@/lib/lenis";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ id, started }: { id: string; started: boolean }) {
  const scrollTo = useScrollTo();

  return (
    <section
      id={id}
      className="relative flex h-screen min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Animated grid background with slow cinematic zoom */}
      <motion.div
        className="absolute inset-0 bg-grid bg-grid-animated mask-vignette"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: EASE }}
      />
      <Particles className="opacity-70" count={46} />

      {/* Ambient crimson glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {started && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8"
          >
            <Image
              src="/Caarapace_logo-removebg-preview.png"
              alt="Caarapace"
              width={200}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </motion.div>
        )}

        {started && (
          <h1 className="max-w-4xl font-heading text-[13vw] font-extrabold leading-[1.02] tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
            <RevealChars text="Engineering Digital" delay={0.5} stagger={0.022} />
            <br />
            <RevealChars text="Transformation" delay={1.1} stagger={0.022} className="text-crimson" />
          </h1>
        )}

        {started && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.75, ease: EASE }}
            className="mt-6 max-w-xl font-body text-base font-medium text-charcoal/60 sm:text-lg"
          >
            Customized ERP. Smart CRM. Digital Experiences.
          </motion.p>
        )}

        {started && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.05, ease: EASE }}
            className="mt-12"
          >
            <Magnetic>
              <button
                onClick={() => scrollTo("#reality")}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-crimson px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.15em] text-white transition-transform duration-300 hover:scale-[1.03]"
              >
                Begin the Experience
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </Magnetic>
          </motion.div>
        )}
      </div>

      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6 }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 text-charcoal/40" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
