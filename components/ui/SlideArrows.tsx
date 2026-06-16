"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";

/**
 * Left/right slide arrows that step through the page one "stop" at a time.
 *
 * A stop is either a section top, or — for sections that pin and reveal
 * sub-stages on scroll — a specific point inside that pinned scroll range.
 * Pinned sections opt in by tagging their ScrollTrigger with an id of the form
 * `stops:<p1>,<p2>,...`, where each value is the trigger PROGRESS (0..1) at
 * which a sub-stage is fully revealed / focal. The author hand-picks these to
 * match each section's actual reveal timing (which is not evenly spaced), so
 * the arrow lands exactly where a stage's animation has settled.
 *
 * Stops are recomputed from live ScrollTrigger geometry on every click so they
 * stay correct across resizes and layout shifts.
 */

const TOLERANCE = 8; // px — treat positions within this as "the same stop"

function computeStops(sectionIds: string[]): number[] {
  const stops: number[] = [];

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    // Is this section pinned with declared sub-stage stops?
    const trigger = ScrollTrigger.getAll().find((t) => {
      const trg = t.trigger as HTMLElement | undefined;
      return trg === el && typeof t.vars.id === "string" && t.vars.id.startsWith("stops:");
    });

    if (trigger) {
      const range = trigger.end - trigger.start;
      const progressPoints = String(trigger.vars.id)
        .slice("stops:".length)
        .split(",")
        .map((v) => parseFloat(v))
        .filter((v) => Number.isFinite(v));
      for (const p of progressPoints) {
        stops.push(trigger.start + gsap.utils.clamp(0, 1, p) * range);
      }
    } else {
      // Plain section: a single stop at its top.
      const top = el.getBoundingClientRect().top + window.scrollY;
      stops.push(top);
    }
  }

  // De-duplicate and sort ascending.
  stops.sort((a, b) => a - b);
  const deduped: number[] = [];
  for (const s of stops) {
    if (deduped.length === 0 || s - deduped[deduped.length - 1] > TOLERANCE) {
      deduped.push(s);
    }
  }
  return deduped;
}

export default function SlideArrows({
  sectionIds,
  visible = true,
}: {
  sectionIds: string[];
  visible?: boolean;
}) {
  const lenis = useLenis();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const refreshEdges = useCallback(() => {
    const stops = computeStops(sectionIds);
    if (stops.length === 0) return;
    const y = window.scrollY;
    setAtStart(y <= stops[0] + TOLERANCE);
    setAtEnd(y >= stops[stops.length - 1] - TOLERANCE);
  }, [sectionIds]);

  useEffect(() => {
    refreshEdges();
    window.addEventListener("scroll", refreshEdges, { passive: true });
    window.addEventListener("resize", refreshEdges);
    return () => {
      window.removeEventListener("scroll", refreshEdges);
      window.removeEventListener("resize", refreshEdges);
    };
  }, [refreshEdges]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const stops = computeStops(sectionIds);
      if (stops.length === 0) return;

      const y = window.scrollY;
      let target: number | undefined;

      if (dir === 1) {
        target = stops.find((s) => s > y + TOLERANCE);
        if (target === undefined) target = stops[stops.length - 1];
      } else {
        for (let i = stops.length - 1; i >= 0; i--) {
          if (stops[i] < y - TOLERANCE) {
            target = stops[i];
            break;
          }
        }
        if (target === undefined) target = stops[0];
      }

      const opts = {
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      };
      if (lenis) {
        lenis.scrollTo(target, opts);
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [lenis, sectionIds]
  );

  const baseBtn =
    "pointer-events-auto group flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/15 bg-white/70 text-charcoal shadow-lg backdrop-blur-md transition-all duration-300 hover:border-crimson hover:bg-crimson hover:text-white disabled:cursor-default disabled:opacity-0";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        disabled={atStart}
        aria-label="Previous"
        className={`fixed left-4 top-1/2 z-50 -translate-y-1/2 sm:left-6 ${baseBtn}`}
      >
        <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={() => go(1)}
        disabled={atEnd}
        aria-label="Next"
        className={`fixed right-4 top-1/2 z-50 -translate-y-1/2 sm:right-6 ${baseBtn}`}
      >
        <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  );
}
