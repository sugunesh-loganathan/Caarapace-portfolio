"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  ConnectIcon,
  ModelIcon,
  VisualizeIcon,
  DecideIcon,
} from "@/components/ui/PipelineIcons";
import SectionHeading from "@/components/ui/SectionHeading";

const PIPELINE = [
  {
    icon: ConnectIcon,
    step: "01",
    title: "Connect your data",
    desc: "We unify ERP, CRM, finance and ops into one clean, governed source of truth.",
  },
  {
    icon: ModelIcon,
    step: "02",
    title: "Model & analyze",
    desc: "Our software cleans, joins and crunches it — finding patterns no spreadsheet could.",
  },
  {
    icon: VisualizeIcon,
    step: "03",
    title: "Visualize live",
    desc: "Interactive dashboards put every metric that matters in front of you, in real time.",
  },
  {
    icon: DecideIcon,
    step: "04",
    title: "Decide & act",
    desc: "Clear, forward-looking insight turns raw numbers into confident decisions.",
  },
];

export default function Challenges({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.92, transformOrigin: "center center" });

      const n = cards.length;
      // Each card owns an evenly-spaced stage. Its stop is the progress at
      // which it becomes the active (highlighted) card.
      const stageFor = (i: number) => (i + 0.5) / n;
      const stopsId =
        "stops:" + cards.map((_, i) => stageFor(i).toFixed(4)).join(",");

      const trigger = ScrollTrigger.create({
        trigger: section,
        id: stopsId,
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Which stage we're focused on (0..n-1).
          const activeF = gsap.utils.clamp(0, n - 1, p * n - 0.5);

          cards.forEach((card, i) => {
            const stage = stageFor(i);
            // Reveal each card a little before its stage; once revealed it stays.
            const reveal = gsap.utils.clamp(0, 1, (p - (stage - 0.18)) / 0.18);

            // Highlight: peaks (1) when this card is the active stage, falls off
            // for neighbours so the active card is scaled up and others dimmed.
            const focus = gsap.utils.clamp(0, 1, 1 - Math.abs(activeF - i));

            gsap.set(card, {
              opacity: reveal * (0.45 + 0.55 * focus),
              y: (1 - reveal) * 60,
              scale: 0.92 + 0.08 * reveal + 0.06 * focus,
            });
          });
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
      className="relative flex h-screen min-h-[720px] w-full items-center overflow-hidden bg-lightgray px-6 lg:px-12"
    >
      {/* Ambient crimson glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "radial-gradient(circle, #B30B3F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <SectionHeading
          eyebrow="Business Intelligence"
          title="From raw data to real decisions."
          subtitle="Business intelligence turns the data your business already generates into a clear, live picture of what's working — and what's costing you. Here's how our software does it."
          align="center"
          className="mx-auto mb-16 max-w-3xl"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="relative overflow-hidden rounded-2xl border border-charcoal/[0.06] bg-white p-6"
              >
                <div className="mb-5 flex items-start justify-between">
                  <span className="font-heading text-4xl font-extrabold text-crimson/70">
                    {p.step}
                  </span>
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-crimson/10 text-crimson">
                    <Icon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="font-heading text-base font-bold tracking-tight text-charcoal">
                  {p.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/60">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
