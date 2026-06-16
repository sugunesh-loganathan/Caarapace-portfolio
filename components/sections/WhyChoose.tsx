"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PILLARS = [
  {
    word: "CUSTOMIZED",
    desc: "Every system tailored to your exact workflows — not the other way around.",
  },
  {
    word: "SCALABLE",
    desc: "Built to grow seamlessly from startup operations to enterprise scale.",
  },
  {
    word: "SECURE",
    desc: "Enterprise-grade architecture safeguarding your most critical data.",
  },
  {
    word: "RELIABLE",
    desc: "Dependable performance, transparent delivery, long-term partnership.",
  },
];

export default function WhyChoose({ id }: { id: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const descRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(wordRefs.current, { opacity: 0, scale: 0.85, filter: "blur(10px)" });
      gsap.set(descRefs.current, { opacity: 0, y: 14 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const n = PILLARS.length;

          PILLARS.forEach((_, i) => {
            const center = (i + 0.5) / n;
            const signedDist = p - center;
            const opacity = gsap.utils.clamp(0, 1, 1 - Math.abs(signedDist) / (1 / n));
            const word = wordRefs.current[i];
            const desc = descRefs.current[i];
            if (word) {
              gsap.set(word, {
                opacity,
                scale: 0.85 + opacity * 0.15,
                filter: `blur(${(1 - opacity) * 10}px)`,
              });
            }
            if (desc) {
              gsap.set(desc, { opacity, y: signedDist * 60 });
            }
          });

          if (counterRef.current) {
            const idx = Math.min(n - 1, Math.floor(p * n));
            counterRef.current.textContent = `0${idx + 1} / 0${n}`;
          }

          const subOpacity = gsap.utils.clamp(0, 1, (p - 0.9) / 0.1);
          if (subRef.current) {
            gsap.set(subRef.current, { opacity: subOpacity, y: (1 - subOpacity) * 20 });
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
      className="relative flex h-screen min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-charcoal"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.05]" aria-hidden="true" />

      <span className="absolute left-6 top-8 font-body text-xs uppercase tracking-[0.3em] text-white/35 lg:left-12 lg:top-12">
        Why Choose Caarapace
      </span>
      <span
        ref={counterRef}
        className="absolute right-6 top-8 font-body text-xs tabular-nums tracking-widest text-white/35 lg:right-12 lg:top-12"
      >
        01 / 04
      </span>

      <div className="relative flex h-[40vh] w-full items-center justify-center px-6">
        {PILLARS.map((p, i) => (
          <div
            key={p.word}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h2 className="font-heading text-[15vw] font-extrabold leading-none tracking-tight text-white sm:text-[12vw] lg:text-[9vw]">
              {p.word}
            </h2>
          </div>
        ))}
      </div>

      <div className="relative mt-4 h-12 w-full max-w-md px-6 text-center">
        {PILLARS.map((p, i) => (
          <p
            key={p.word}
            ref={(el) => {
              descRefs.current[i] = el;
            }}
            className="absolute inset-x-0 top-0 font-body text-sm text-white/55 sm:text-base"
          >
            {p.desc}
          </p>
        ))}
      </div>

      <div
        ref={subRef}
        className="absolute bottom-14 flex flex-col items-center gap-2 px-6 text-center"
      >
        <span className="h-px w-10 bg-crimson" />
        <p className="font-heading text-lg font-bold tracking-wide text-white sm:text-xl">
          Your Strategic Technology Partner.
        </p>
      </div>
    </section>
  );
}
