"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { RevealChars } from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { useScrollTo } from "@/lib/lenis";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ id, started }: { id: string; started: boolean }) {
  const scrollTo = useScrollTo();

  return (
    <section
      id={id}
      className="relative flex h-screen min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* WebGL smoke background: high-contrast white smoke over Tech Black,
          with a deep crimson undertone in the mid-densities. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: EASE }}
        aria-hidden="true"
      >
        <SmokeBackground smokeColor="#9E0B36" />
      </motion.div>

<div className="relative z-10 flex flex-col items-center px-6 text-center">
        {started && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-12 backdrop-blur-md sm:px-14 sm:py-14"
            style={{ boxShadow: "0 0 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
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

            <h1
              className="max-w-4xl font-heading text-[13vw] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.6)" }}
            >
              <RevealChars text="Engineering Digital" delay={0.5} stagger={0.022} />
              <br />
              <RevealChars text="Transformation" delay={1.1} stagger={0.022} className="text-crimson-light" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.75, ease: EASE }}
              className="mt-6 max-w-xl font-body text-base font-semibold tracking-wide text-charcoal sm:text-lg"
              style={{ textShadow: "0 1px 20px rgba(255,255,255,0.6)" }}
            >
              Customized ERP. Smart CRM. Digital Experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.05, ease: EASE }}
              className="mt-12"
            >
              <Magnetic>
                <button
                  onClick={() => scrollTo("#reality")}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-md border border-crimson bg-crimson px-9 py-4 font-body text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-crimson-dark"
                  style={{ boxShadow: "0 0 24px rgba(177,11,63,0.35)" }}
                >
                  {/* Sweep highlight on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Begin the Experience
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </Magnetic>
            </motion.div>
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
