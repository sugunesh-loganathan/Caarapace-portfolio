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

// SVG canvas the path is drawn in.
const VB_W = 1000;
const VB_H = 220;

// A gentle wave that travels left→right, threading through 5 evenly spaced
// peaks/troughs. Nodes sit at x = 60, 295, 530, 765, 940.
const NODE_X = [60, 295, 530, 765, 940];
const NODE_Y = [150, 70, 150, 70, 150];
const PATH_D = `M ${NODE_X[0]} ${NODE_Y[0]}
  C 150 150, 205 70, ${NODE_X[1]} ${NODE_Y[1]}
  C 385 70, 440 150, ${NODE_X[2]} ${NODE_Y[2]}
  C 620 150, 675 70, ${NODE_X[3]} ${NODE_Y[3]}
  C 855 70, 880 150, ${NODE_X[4]} ${NODE_Y[4]}`;

export default function Journey({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    const draw = drawRef.current;
    if (!section || !path || !draw) return;

    const ctx = gsap.context(() => {
      const n = STAGES.length;
      const total = path.getTotalLength();

      // Position each node container exactly on the curve. The SVG scales
      // responsively, so we place nodes with percentage coords matching the
      // viewBox point, letting the wrapper's aspect ratio handle the rest.
      const nodeT = NODE_X.map((_, i) => i / (n - 1));

      // Prime the draw: full dash, fully offset (hidden).
      gsap.set(draw, { strokeDasharray: total, strokeDashoffset: total });
      gsap.set(descRefs.current, { opacity: 0, y: 16 });
      gsap.set(nodeRefs.current, { scale: 0.78 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        id: "stops:0.08,0.25,0.5,0.75,0.97",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Draw the crimson stroke up to progress p.
          gsap.set(draw, { strokeDashoffset: total * (1 - p) });

          // Move the pulse to the live tip of the drawn stroke, along the
          // real curve (not a straight interpolation).
          if (pulseRef.current) {
            const pt = path.getPointAtLength(total * p);
            gsap.set(pulseRef.current, {
              attr: { transform: `translate(${pt.x}, ${pt.y})` },
              opacity: p > 0.005 && p < 0.995 ? 1 : 0,
            });
          }

          const reached = p * (n - 1);
          const activeIndex = Math.round(reached);

          STAGES.forEach((_, i) => {
            // Activates as the draw passes this node's position on the path.
            const fill = gsap.utils.clamp(0, 1, (p - nodeT[i] + 0.04) / 0.08);
            const isActive = fill > 0.5;

            const node = nodeRefs.current[i];
            if (node) {
              const scale = 0.78 + gsap.utils.clamp(0, 1, fill * 1.15) * 0.27;
              gsap.set(node, { scale });
              node.classList.toggle("bg-crimson", isActive);
              node.classList.toggle("border-crimson", isActive);
              node.classList.toggle("border-charcoal/15", !isActive);
              node.classList.toggle("bg-white", !isActive);
              node.classList.toggle("shadow-[0_0_28px_rgba(179,11,63,0.5)]", isActive);
            }
            const icon = iconRefs.current[i];
            if (icon) {
              icon.classList.toggle("text-white", isActive);
              icon.classList.toggle("text-charcoal", !isActive);
            }
            const label = labelRefs.current[i];
            if (label) {
              label.classList.toggle("text-crimson", isActive);
              label.classList.toggle("text-charcoal", !isActive);
            }

            // Only the nearest stage's description shows.
            const dist = Math.abs(reached - i);
            const opacity = gsap.utils.clamp(0, 1, 1 - dist / 0.5);
            const desc = descRefs.current[i];
            if (desc) {
              gsap.set(desc, {
                opacity,
                y: (i - reached) * 22,
                pointerEvents: i === activeIndex ? "auto" : "none",
              });
            }
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
          className="mx-auto mb-20 max-w-2xl"
        />

        {/* Path + nodes share one box so percentage-positioned nodes line up
            with the SVG viewBox coordinates. */}
        <div
          className="relative mx-auto w-full max-w-4xl"
          style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Base track */}
            <path
              ref={pathRef}
              d={PATH_D}
              stroke="#2D2D2D"
              strokeOpacity={0.12}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Animated crimson draw */}
            <path
              ref={drawRef}
              d={PATH_D}
              stroke="#B30B3F"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Travelling glow pulse */}
            <g ref={pulseRef} opacity={0}>
              <circle r={14} fill="#B30B3F" opacity={0.18} />
              <circle r={6} fill="#B30B3F" />
              <circle r={6} fill="#B30B3F">
                <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

          {/* Nodes + labels, positioned over the SVG by viewBox % */}
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                style={{ left: `${(NODE_X[i] / VB_W) * 100}%`, top: `${(NODE_Y[i] / VB_H) * 100}%` }}
              >
                <div
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-charcoal/15 bg-white shadow-sm transition-[background-color,border-color,box-shadow] duration-300 sm:h-14 sm:w-14"
                >
                  <div
                    ref={(el) => {
                      iconRefs.current[i] = el;
                    }}
                    className="text-charcoal transition-colors duration-300"
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                  </div>
                </div>
                <span
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className="font-heading text-xs font-bold uppercase tracking-wider text-charcoal transition-colors duration-300 sm:text-sm"
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative mx-auto mt-16 h-20 w-full max-w-lg text-center">
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
