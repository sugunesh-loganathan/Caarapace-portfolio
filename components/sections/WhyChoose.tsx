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
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set(wordRefs.current, { opacity: 0, scale: 0.85, filter: "blur(10px)" });
      gsap.set(descRefs.current, { opacity: 0, y: 14 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const finalLeft = vw >= 1024 ? 48 : 24;
      const finalTop = vw >= 1024 ? 48 : 32;

      // Title starts centered and large
      gsap.set(titleRef.current, {
        position: "absolute",
        left: 0,
        top: 0,
        x: vw / 2,
        y: vh / 2,
        xPercent: -50,
        yPercent: -50,
        scale: 2.4,
      });

      // The first TITLE_STAGE of the scroll is a dedicated substage for the
      // title. It rests centered & large until TITLE_HOLD (giving the reader a
      // beat after the pin engages), then flies to the corner and docks at
      // TITLE_STAGE — only after which the pillars begin.
      const TITLE_HOLD = 0.12;
      const TITLE_STAGE = 0.3;

      const trigger = ScrollTrigger.create({
        trigger: section,
        id: "stops:0.06,0.3875,0.5625,0.7375,0.9125",
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const n = PILLARS.length;

          // Title holds centered until TITLE_HOLD, then flies to the corner,
          // docking at TITLE_STAGE.
          const titleRaw = gsap.utils.clamp(
            0,
            1,
            (p - TITLE_HOLD) / (TITLE_STAGE - TITLE_HOLD)
          );
          // Ease-out cubic: starts fast, decelerates smoothly into the corner
          const tp = 1 - Math.pow(1 - titleRaw, 3);

          gsap.set(titleRef.current, {
            x: gsap.utils.interpolate(vw / 2, finalLeft, tp),
            y: gsap.utils.interpolate(vh / 2, finalTop, tp),
            xPercent: gsap.utils.interpolate(-50, 0, tp),
            yPercent: gsap.utils.interpolate(-50, 0, tp),
            scale: gsap.utils.interpolate(2.4, 1, tp),
          });

          // Pillars occupy the remaining progress after the title has docked.
          const pp = gsap.utils.clamp(0, 1, (p - TITLE_STAGE) / (1 - TITLE_STAGE));

          // Fade pillars in from zero at the very start so the first word
          // doesn't bleed through while the title is still centered.
          const pillarIntro = gsap.utils.clamp(0, 1, pp / 0.06);

          PILLARS.forEach((_, i) => {
            const center = (i + 0.5) / n;
            const signedDist = pp - center;
            const opacity =
              gsap.utils.clamp(0, 1, 1 - Math.abs(signedDist) / (1 / n)) *
              (i === 0 ? pillarIntro : 1);
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
            const idx = Math.min(n - 1, Math.floor(pp * n));
            counterRef.current.textContent = `0${idx + 1} / 0${n}`;
          }

          const subOpacity = gsap.utils.clamp(0, 1, (pp - 0.9) / 0.1);
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
      className="relative flex h-screen min-h-[720px] w-full flex-col items-center justify-center overflow-hidden bg-crimson"
    >
      <div className="absolute inset-0 bg-grid opacity-[0.06]" aria-hidden="true" />

      {/* Title: initial CSS matches GSAP start state to prevent flash */}
      <span
        ref={titleRef}
        className="font-body text-sm font-bold uppercase tracking-[0.3em] text-white/35"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(2.4)",
        }}
      >
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
            className="absolute inset-x-0 top-0 font-body text-base font-semibold text-white sm:text-lg"
          >
            {p.desc}
          </p>
        ))}
      </div>

      <div
        ref={subRef}
        className="absolute bottom-14 flex flex-col items-center gap-2 px-6 text-center"
      >
        <span className="h-px w-10 bg-white/60" />
        <p className="font-heading text-lg font-bold tracking-wide text-white sm:text-xl">
          Your Strategic Technology Partner.
        </p>
      </div>
    </section>
  );
}
