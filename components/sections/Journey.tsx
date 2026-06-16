"use client";

import { useEffect, useRef } from "react";
import { Compass, Code2, Rocket, LifeBuoy, TrendingUp } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import Particles from "@/components/ui/Particles";

const STAGES = [
  { icon: Compass, label: "Strategy", desc: "Aligning technology with your business goals from day one." },
  { icon: Code2, label: "Development", desc: "Engineering tailored systems with precision and craftsmanship." },
  { icon: Rocket, label: "Deployment", desc: "Seamless rollout with zero disruption to your operations." },
  { icon: LifeBuoy, label: "Support", desc: "Dedicated support ensuring continuous, reliable performance." },
  { icon: TrendingUp, label: "Growth", desc: "Evolving your platform as your business scales further." },
];

export default function Journey({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(lineFillRef.current, { scaleX: 0 });
      gsap.set(descRefs.current, { opacity: 0, y: 12 });

      const n = STAGES.length;
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=280%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(lineFillRef.current, { scaleX: p });

          STAGES.forEach((_, i) => {
            const threshold = i / (n - 1);
            const local = gsap.utils.clamp(0, 1, (p - threshold + 0.06) / 0.12);
            const node = nodeRefs.current[i];
            if (node) {
              gsap.set(node, { scale: 0.85 + local * 0.25 });
              node.classList.toggle("bg-crimson", local > 0.5);
              node.classList.toggle("border-crimson", local > 0.5);
              node.classList.toggle("bg-white", local <= 0.5);
            }

            const center = threshold;
            const fadeWindow = 1 / (n - 1);
            const signedDist = p - center;
            const opacity = gsap.utils.clamp(0, 1, 1 - Math.abs(signedDist) / fadeWindow);
            const desc = descRefs.current[i];
            if (desc) gsap.set(desc, { opacity, y: signedDist * 50 });
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
      className="relative flex h-screen min-h-[760px] w-full flex-col items-center justify-center overflow-hidden bg-white px-6 lg:px-12"
    >
      <Particles className="opacity-30" count={26} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow="Building The Future Together"
          title="Innovation Starts With Partnership."
          align="center"
          className="mx-auto mb-24 max-w-2xl"
        />

        <div className="relative mx-auto flex w-full max-w-4xl items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-charcoal/10" />
          <div
            ref={lineFillRef}
            className="absolute left-0 top-1/2 h-[2px] w-full origin-left -translate-y-1/2 bg-crimson"
          />

          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-3">
                <div
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-charcoal/15 bg-white shadow-sm transition-colors duration-300 sm:h-14 sm:w-14"
                >
                  <Icon
                    className="h-5 w-5 text-charcoal transition-colors duration-300 sm:h-6 sm:w-6"
                    strokeWidth={1.75}
                  />
                </div>
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-charcoal sm:text-sm">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative mx-auto mt-10 h-12 w-full max-w-md text-center">
          {STAGES.map((s, i) => (
            <p
              key={s.label}
              ref={(el) => {
                descRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 font-body text-sm text-charcoal/55 sm:text-base"
            >
              {s.desc}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
