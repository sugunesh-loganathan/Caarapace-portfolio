"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.body.style.overflow = "hidden";

    if (reduceMotion) {
      setProgress(100);
      const t = setTimeout(() => {
        setHidden(true);
        document.body.style.overflow = "";
        onComplete();
      }, 300);
      return () => clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    const duration = 2200;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setHidden(true);
          document.body.style.overflow = "";
          onComplete();
        }, 450);
      }
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: EASE },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Image
              src="/logo.png"
              alt="Caarapace"
              width={64}
              height={64}
              priority
              className="h-16 w-16 object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="font-heading text-sm font-semibold tracking-[0.3em] text-charcoal/50">
              CAARAPACE
            </span>
          </motion.div>

          <div className="mt-10 h-px w-44 overflow-hidden bg-charcoal/10">
            <motion.div
              className="h-full bg-crimson"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 font-body text-xs tabular-nums tracking-widest text-charcoal/40"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
