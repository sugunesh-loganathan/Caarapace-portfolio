"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";

type Node = { x: number; y: number; stage: 1 | 2 | 3 };
type Edge = { from: number; to: number; stage: 1 | 2 | 3 };

const NODES: Node[] = [
  { x: 120, y: 120, stage: 1 },
  { x: 260, y: 80, stage: 1 },
  { x: 400, y: 150, stage: 1 },
  { x: 180, y: 260, stage: 1 },
  { x: 340, y: 300, stage: 1 },
  { x: 500, y: 220, stage: 1 },
  { x: 620, y: 120, stage: 2 },
  { x: 760, y: 90, stage: 2 },
  { x: 860, y: 180, stage: 2 },
  { x: 900, y: 300, stage: 2 },
  { x: 760, y: 320, stage: 2 },
  { x: 600, y: 360, stage: 2 },
  { x: 460, y: 400, stage: 3 },
  { x: 300, y: 420, stage: 3 },
  { x: 150, y: 400, stage: 3 },
  { x: 80, y: 300, stage: 3 },
  { x: 520, y: 480, stage: 3 },
  { x: 700, y: 460, stage: 3 },
];

const EDGES: Edge[] = [
  { from: 0, to: 1, stage: 1 },
  { from: 1, to: 2, stage: 1 },
  { from: 2, to: 4, stage: 1 },
  { from: 4, to: 3, stage: 1 },
  { from: 3, to: 0, stage: 1 },
  { from: 2, to: 5, stage: 1 },
  { from: 5, to: 6, stage: 2 },
  { from: 6, to: 7, stage: 2 },
  { from: 7, to: 8, stage: 2 },
  { from: 8, to: 9, stage: 2 },
  { from: 9, to: 10, stage: 2 },
  { from: 10, to: 11, stage: 2 },
  { from: 11, to: 5, stage: 2 },
  { from: 4, to: 11, stage: 2 },
  { from: 1, to: 6, stage: 2 },
  { from: 11, to: 12, stage: 3 },
  { from: 12, to: 13, stage: 3 },
  { from: 13, to: 14, stage: 3 },
  { from: 14, to: 15, stage: 3 },
  { from: 15, to: 0, stage: 3 },
  { from: 12, to: 16, stage: 3 },
  { from: 16, to: 17, stage: 3 },
  { from: 17, to: 10, stage: 3 },
  { from: 13, to: 16, stage: 3 },
  { from: 3, to: 14, stage: 3 },
  { from: 5, to: 12, stage: 3 },
  { from: 2, to: 9, stage: 3 },
];

const NODE_STAGE_START: Record<number, number> = { 1: 0, 2: 0.3, 3: 0.62 };
const NODE_WINDOW = 0.2;
const EDGE_STAGE_START: Record<number, number> = { 1: 0, 2: 0.32, 3: 0.64 };
const EDGE_WINDOW = 0.3;

const MESSAGES = [
  "Increasing operational complexity.",
  "Fragmented systems.",
  "Growing customer expectations.",
];

function dist(a: Node, b: Node) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function BusinessReality({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const msgRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const flowActive = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    if (!section || !svg) return;

    const ctx = gsap.context(() => {
      const edgeEls = gsap.utils.toArray<SVGLineElement>(".net-edge", svg);
      const nodeEls = gsap.utils.toArray<SVGCircleElement>(".net-node", svg);
      const flowLayer = svg.querySelector<SVGGElement>(".net-flow-layer");

      const edgeLengths = EDGES.map((e) => dist(NODES[e.from], NODES[e.to]));

      edgeEls.forEach((line, i) => {
        gsap.set(line, {
          strokeDasharray: edgeLengths[i],
          strokeDashoffset: edgeLengths[i],
        });
      });
      gsap.set(nodeEls, { opacity: 0, scale: 0.4, transformOrigin: "center" });
      gsap.set(msgRefs.current, { opacity: 0, y: 16 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          edgeEls.forEach((line, i) => {
            const edge = EDGES[i];
            const startAt = EDGE_STAGE_START[edge.stage];
            const local = gsap.utils.clamp(0, 1, (p - startAt) / EDGE_WINDOW);
            gsap.set(line, { strokeDashoffset: edgeLengths[i] * (1 - local) });
          });

          nodeEls.forEach((node, i) => {
            const n = NODES[i];
            const startAt = NODE_STAGE_START[n.stage];
            const local = gsap.utils.clamp(0, 1, (p - startAt) / NODE_WINDOW);
            gsap.set(node, { opacity: local, scale: 0.4 + local * 0.6 });
          });

          MESSAGES.forEach((_, m) => {
            const center = (m + 0.5) / 3;
            const signedDist = p - center;
            const opacity = gsap.utils.clamp(0, 1, 1 - Math.abs(signedDist) / (1 / 3));
            const el = msgRefs.current[m];
            if (el) gsap.set(el, { opacity, y: signedDist * 70 });
          });

          const shouldFlow = p > 0.66;
          if (shouldFlow !== flowActive.current && flowLayer) {
            flowActive.current = shouldFlow;
            flowLayer.classList.toggle("opacity-100", shouldFlow);
            flowLayer.classList.toggle("opacity-0", !shouldFlow);
          }
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
      className="relative flex h-screen min-h-[720px] w-full flex-col overflow-hidden bg-white"
    >
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-6 py-20 lg:px-12">
        <SectionHeading
          eyebrow="The Reality"
          title="The Digital World Demands More."
          className="mb-4"
        />

        <div className="relative flex-1">
          <svg
            ref={svgRef}
            viewBox="0 0 980 540"
            className="absolute inset-0 h-full w-full opacity-90"
            preserveAspectRatio="xMidYMid meet"
          >
            <g className="net-flow-layer opacity-0 transition-opacity duration-700">
              {EDGES.filter((e) => e.stage === 1).map((e, i) => (
                <line
                  key={`flow-${i}`}
                  x1={NODES[e.from].x}
                  y1={NODES[e.from].y}
                  x2={NODES[e.to].x}
                  y2={NODES[e.to].y}
                  stroke="#B30B3F"
                  strokeWidth={2}
                  strokeDasharray="4 14"
                  strokeLinecap="round"
                  className="animate-[dash-flow_1.4s_linear_infinite]"
                />
              ))}
            </g>

            {EDGES.map((e, i) => (
              <line
                key={i}
                className="net-edge"
                x1={NODES[e.from].x}
                y1={NODES[e.from].y}
                x2={NODES[e.to].x}
                y2={NODES[e.to].y}
                stroke="#2D2D2D"
                strokeOpacity={0.22}
                strokeWidth={1.5}
              />
            ))}

            {NODES.map((n, i) => (
              <circle
                key={i}
                className="net-node"
                cx={n.x}
                cy={n.y}
                r={n.stage === 1 ? 7 : n.stage === 2 ? 6 : 5}
                fill={n.stage === 1 ? "#B30B3F" : "#2D2D2D"}
              />
            ))}
          </svg>

          <div className="absolute bottom-8 left-0 max-w-md sm:bottom-12">
            {MESSAGES.map((msg, i) => (
              <p
                key={i}
                ref={(el) => {
                  msgRefs.current[i] = el;
                }}
                className="absolute bottom-0 left-0 font-heading text-2xl font-bold text-charcoal sm:text-3xl"
              >
                {msg}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
