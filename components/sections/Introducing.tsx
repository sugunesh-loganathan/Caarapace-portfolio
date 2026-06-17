"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealWords } from "@/components/ui/RevealText";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES: CarouselItem[] = [
  { id: 1, title: "HRMS", subtitle: "People & Payroll" },
  { id: 2, title: "Smart CRM", subtitle: "Sales & Relationships" },
  { id: 3, title: "C-Deck ERP", subtitle: "Operations Core" },
  { id: 4, title: "C-Forge ERP", subtitle: "Manufacturing" },
  { id: 5, title: "Custom Apps", subtitle: "Built For You" },
];

export default function Introducing({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Scroll-driven active item (fractional, so the carousel tracks scroll
  // smoothly rather than snapping between items).
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const n = SERVICES.length;
    // One stop per service, evenly spaced so the side nav steps through each
    // item as its own sub-stage: p = i / (n - 1).
    const stops = Array.from({ length: n }, (_, i) => (i / (n - 1)).toFixed(4));

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        id: "stops:" + stops.join(","),
        start: "top top",
        // Give each of the n items real scroll room before moving on.
        end: "+=" + n * 80 + "%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setActiveIndex(self.progress * (n - 1));
        },
      });
      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-28"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.04]" aria-hidden="true" />

      {/* Ambient crimson glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full flex-col items-center text-center">
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

        <h2 className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal text-balance sm:text-5xl lg:text-6xl">
          <RevealWords text="Technology Built Around Your Business." />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 font-body text-lg text-charcoal/55"
        >
          We don&apos;t sell products. We build solutions.
        </motion.p>

        {/* Service carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-16 w-full"
        >
          <RulerCarousel originalItems={SERVICES} activeIndex={activeIndex} />
        </motion.div>
      </div>
    </section>
  );
}
