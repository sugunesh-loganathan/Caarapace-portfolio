"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScrollTo } from "@/lib/lenis";

export interface SectionNavItem {
  id: string;
  label: string;
}

export default function SectionNav({
  sections,
  visible = true,
}: {
  sections: SectionNavItem[];
  visible?: boolean;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const scrollTo = useScrollTo();

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            if (!best || ratio > best.ratio) {
              best = { id: entry.target.id, ratio };
            }
          }
        }
        if (best) setActive(best.id);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: "-10% 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      aria-label="Section navigation"
    >
      {sections.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(`#${s.id}`)}
            className="group flex items-center gap-3"
            aria-label={`Go to ${s.label}`}
            aria-current={isActive}
          >
            <span
              className={`font-body text-[10px] uppercase tracking-[0.18em] text-charcoal/0 transition-all duration-300 group-hover:text-charcoal/60 ${
                isActive ? "text-charcoal/70" : ""
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-[6px] w-[6px] rounded-full border transition-all duration-300 ${
                isActive
                  ? "scale-125 border-crimson bg-crimson"
                  : "border-charcoal/30 bg-transparent group-hover:border-crimson/60"
              }`}
            />
          </button>
        );
      })}
    </motion.nav>
  );
}
