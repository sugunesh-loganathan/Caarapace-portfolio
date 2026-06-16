"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Globe, Layers, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICES = [
  {
    icon: Building2,
    title: "Customized ERP Solutions",
    description:
      "Unify finance, operations, and resources into one intelligent system built around how your business actually runs.",
  },
  {
    icon: Users,
    title: "Smart CRM Solutions",
    description:
      "Turn every customer interaction into insight with a CRM tailored to your sales motion and service model.",
  },
  {
    icon: Globe,
    title: "Custom Website Development",
    description:
      "Premium, high-performance web experiences engineered to convert and built to scale with your brand.",
  },
  {
    icon: Layers,
    title: "Industry-Specific Digital Solutions",
    description:
      "Purpose-built platforms addressing the unique regulatory and operational demands of your sector.",
  },
];

export default function Deliverables({ id }: { id: string }) {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".deliver-card", container);
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} className="relative w-full bg-lightgray px-6 py-28 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What We Deliver"
          title="Engineered Solutions, Not Off-The-Shelf Products."
          className="mb-16"
        />

        <div
          ref={containerRef}
          className="flex flex-col gap-5 lg:h-[480px] lg:flex-row"
        >
          {SERVICES.map((s, i) => {
            const isActive = active === i;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                className="deliver-card relative cursor-pointer overflow-hidden rounded-2xl bg-charcoal"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                animate={{ flexGrow: isActive ? 2.4 : 1 }}
                transition={{ duration: 0.65, ease: EASE }}
                style={{ flexBasis: 0 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: isActive
                      ? "linear-gradient(135deg, #B30B3F 0%, #7d0830 100%)"
                      : "linear-gradient(135deg, #2D2D2D 0%, #232323 100%)",
                  }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-grid opacity-[0.05]" aria-hidden="true" />

                <div className="relative z-10 flex h-full min-w-[210px] flex-col justify-between p-7 lg:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-heading text-sm font-semibold tracking-widest text-white/35">
                      0{i + 1}
                    </span>
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    </motion.div>
                  </div>

                  <div>
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10"
                    >
                      <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
                    </motion.div>
                    <h3 className="font-heading text-xl font-bold leading-snug text-white lg:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-white/65">
                      {s.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
