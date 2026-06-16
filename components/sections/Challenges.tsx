"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Workflow, Database, GaugeCircle, EyeOff } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const EASE = [0.16, 1, 0.3, 1] as const;

const CHALLENGES = [
  {
    icon: Workflow,
    title: "Manual Processes",
    description: "Repetitive tasks consume hours that should be spent on strategy and growth.",
  },
  {
    icon: Database,
    title: "Data Silos",
    description: "Critical information trapped in disconnected systems, invisible to decision-makers.",
  },
  {
    icon: GaugeCircle,
    title: "Inefficiencies",
    description: "Friction between teams and tools slows down every operation across the business.",
  },
  {
    icon: EyeOff,
    title: "Limited Visibility",
    description: "Leaders fly blind without real-time insight into performance and risk.",
  },
];

function TiltCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: typeof Workflow;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 200, damping: 22 });
  const springY = useSpring(y, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: EASE }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-2xl border border-charcoal/[0.06] bg-lightgray p-8 shadow-[0_20px_60px_-30px_rgba(45,45,45,0.25)] transition-shadow duration-300 hover:shadow-[0_30px_80px_-30px_rgba(179,11,63,0.25)]"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
          <Icon className="h-6 w-6 text-crimson" strokeWidth={1.75} />
        </div>
        <h3 className="font-heading text-xl font-bold text-charcoal">{title}</h3>
        <p className="mt-3 font-body text-sm leading-relaxed text-charcoal/60">
          {description}
        </p>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-crimson/[0.06] transition-transform duration-500 group-hover:scale-150" />
      </motion.div>
    </motion.div>
  );
}

export default function Challenges({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="relative w-full bg-white px-6 py-28 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The Challenges"
          title="Disconnected Systems Create Invisible Barriers."
          align="center"
          className="mx-auto mb-16 max-w-3xl"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CHALLENGES.map((c, i) => (
            <TiltCard key={c.title} index={i} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
