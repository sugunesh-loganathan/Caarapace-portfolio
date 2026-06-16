"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  TrendingUp,
  Gauge,
  Search,
  LineChart,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

type Metric = { value: number; suffix: string; label: string; decimals?: number };

const METRICS: Metric[] = [
  { value: 18, suffix: "%", label: "Avg. revenue leakage uncovered" },
  { value: 60, suffix: "%", label: "Faster, data-backed decisions" },
  { value: 12, suffix: "hrs", label: "Manual reporting saved / week" },
  { value: 1, suffix: "", label: "Single source of truth", decimals: 0 },
];

type Solution = {
  icon: typeof TrendingUp;
  problem: string;
  title: string;
  desc: string;
};

const SOLUTIONS: Solution[] = [
  {
    icon: Search,
    problem: "Money slips through the cracks",
    title: "Find the leakage in your finances",
    desc: "We surface where margin quietly erodes — unbilled work, pricing gaps, silent churn — so every rupee is accounted for.",
  },
  {
    icon: Gauge,
    problem: "Decisions made in the dark",
    title: "Your whole firm at your fingertips",
    desc: "Live dashboards unify sales, ops and finance into one view, so you steer the business on signal — not gut feel.",
  },
  {
    icon: LineChart,
    problem: "Reacting instead of predicting",
    title: "See what's coming, not just what happened",
    desc: "Forecasting and trend analysis turn your historical data into a forward view of demand, cash flow and risk.",
  },
  {
    icon: Workflow,
    problem: "Teams stuck in busywork",
    title: "Automate the reporting grind",
    desc: "Reports that took analysts days now build themselves — freeing your people to act on insight, not assemble it.",
  },
  {
    icon: TrendingUp,
    problem: "Growth without a playbook",
    title: "Know exactly what to scale",
    desc: "Pinpoint your most profitable segments, products and channels so growth spend goes where it actually compounds.",
  },
  {
    icon: ShieldCheck,
    problem: "Data you can't trust",
    title: "One clean, governed source of truth",
    desc: "We consolidate fragmented systems into a single, reliable data layer — consistent numbers everyone can stand behind.",
  },
];

function Metric({
  metric,
  countRef,
}: {
  metric: Metric;
  countRef: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline font-heading text-4xl font-extrabold tracking-tight text-charcoal sm:text-5xl">
        <span ref={countRef} className="tabular-nums">
          0
        </span>
        <span className="text-crimson">{metric.suffix}</span>
      </div>
      <p className="mt-2 max-w-[14rem] font-body text-sm font-medium text-charcoal/55">
        {metric.label}
      </p>
    </div>
  );
}

export default function BusinessReality({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  const countRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const savingsRef = useRef<HTMLSpanElement>(null);
  const countersDone = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const panelA = panelARef.current;
    const panelB = panelBRef.current;
    if (!section || !panelA || !panelB) return;

    const ctx = gsap.context(() => {
      // Panel B starts hidden, slightly below.
      gsap.set(panelB, { opacity: 0, y: 40 });

      const runCounters = () => {
        if (countersDone.current) return;
        countersDone.current = true;
        countRefs.current.forEach((el, i) => {
          if (!el) return;
          const m = METRICS[i];
          const obj = { val: 0 };
          gsap.to(obj, {
            val: m.value,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = obj.val.toFixed(m.decimals ?? 0);
            },
          });
        });

        // Big savings stat counts up to 6.5.
        if (savingsRef.current) {
          const el = savingsRef.current;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: 6.5,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = obj.val.toFixed(1);
            },
          });
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        id: "stops:0.2,0.78",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Kick off the count-up once the section is settled into view.
          if (p > 0.05) runCounters();

          // Cross-fade A -> B around the midpoint of the scroll.
          // A fades out over 0.30..0.55, B fades in over 0.45..0.70.
          const aOut = gsap.utils.clamp(0, 1, (p - 0.3) / 0.25);
          const bIn = gsap.utils.clamp(0, 1, (p - 0.45) / 0.25);

          gsap.set(panelA, { opacity: 1 - aOut, y: -aOut * 40 });
          gsap.set(panelB, { opacity: bIn, y: (1 - bIn) * 40 });
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
      className="relative flex h-screen min-h-[720px] w-full items-center overflow-hidden bg-white"
    >
      {/* Faint ambient crimson glow, top-right */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* PANEL A — intro: crab + heading + metrics */}
        <div ref={panelARef} className="w-full">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Heading */}
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="What We Solve"
                title="Turn your data into decisions."
                subtitle="Caarapace puts business intelligence to work — exposing what's draining your margin, and handing you the control to fix it."
              />

              {/* Headline savings stat */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="mt-8 flex items-baseline gap-3"
              >
                <span className="font-heading text-6xl font-extrabold leading-none tracking-tight text-crimson sm:text-7xl">
                  ₹<span ref={savingsRef} className="tabular-nums">0</span> Cr
                </span>
              </motion.div>
              <p className="mt-2 font-body text-base font-semibold text-charcoal/70">
                saved for our clients using our software.
              </p>
            </div>

            {/* Crab mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative mx-auto flex w-full max-w-[20rem] items-center justify-center lg:max-w-sm"
            >
              {/* Soft crimson halo behind the mascot */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
                style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
                aria-hidden="true"
              />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full"
              >
                <Image
                  src="/crab-mascot.png"
                  alt="Caarapace mascot pointing at a rising business intelligence chart"
                  width={480}
                  height={480}
                  className="h-auto w-full select-none object-contain drop-shadow-xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Headline metrics */}
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-charcoal/10 py-8 lg:mt-12 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <Metric
                key={m.label}
                metric={m}
                countRef={(el) => {
                  countRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        {/* PANEL B — solution cards (absolutely overlaid, fades in on scroll) */}
        <div
          ref={panelBRef}
          className="absolute inset-x-0 top-1/2 z-20 mx-auto w-full max-w-7xl -translate-y-1/2 px-6 lg:px-12"
        >
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="group relative flex flex-col bg-white p-6 transition-colors duration-300 hover:bg-lightgray lg:p-7"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-crimson/10 text-crimson transition-colors duration-300 group-hover:bg-crimson group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>

                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">
                    {s.problem}
                  </p>
                  <h3 className="mt-1.5 font-heading text-lg font-bold leading-snug tracking-tight text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/60">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
