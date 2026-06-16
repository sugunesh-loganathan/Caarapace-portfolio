"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { RevealWords } from "@/components/ui/RevealText";
import { DottedSurface } from "@/components/ui/dotted-surface";
import Magnetic from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;
const CONTACT_EMAIL = "info@caarapace.com";

export default function Finale({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-28"
    >
      {/* 3D animated dotted surface (crimson dots over white) */}
      <DottedSurface />

      {/* Soft white wash so the content stays legible over the dot field */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)",
        }}
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
          <Image
              src="/Caarapace_logo-removebg-preview.png"
              alt="Caarapace"
              width={200}
              height={56}
              className="h-14 w-auto object-contain"
            />
        </motion.div>

        <h2 className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal text-balance sm:text-5xl lg:text-6xl">
          <RevealWords text="Let's Build The Future Together." />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-6 max-w-md font-body text-base text-charcoal/55 sm:text-lg"
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
          className="mt-8 flex items-center gap-2 font-body text-sm text-charcoal/50 transition-colors duration-300 hover:text-crimson"
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
          <span className="h-px w-6 bg-charcoal/20" />
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-charcoal/35">
            Caarapace
          </span>
          <span className="h-px w-6 bg-charcoal/20" />
        </motion.div>
      </div>
    </section>
  );
}
