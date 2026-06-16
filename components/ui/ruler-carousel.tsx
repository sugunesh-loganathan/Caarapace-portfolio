"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
  subtitle?: string;
}

type InfiniteItem = CarouselItem & { key: string; originalIndex: number };

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]): InfiniteItem[] => {
  const items: InfiniteItem[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        key: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-charcoal/20";

    if (isCenter) {
      height = "h-8";
      color = "bg-crimson";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-charcoal/50";
    }

    const positionClass = top ? "" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />,
    );
  }

  return <div className="relative h-8 w-full px-4">{lines}</div>;
};

const ITEM_WIDTH = 440; // px per slot (width + gap)

export function RulerCarousel({
  originalItems,
}: {
  originalItems: CarouselItem[];
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Start centered on the first item of the middle set.
  const [activeIndex, setActiveIndex] = useState(itemsPerSet);
  const [isResetting, setIsResetting] = useState(false);

  // Timestamp of the last manual interaction, so auto-advance can hold off
  // briefly instead of fighting the user.
  const lastInteraction = useRef(0);
  const markInteraction = () => {
    lastInteraction.current = Date.now();
  };

  const handleItemClick = (newIndex: number) => {
    markInteraction();
    if (isResetting) return;

    const targetOriginalIndex = newIndex % itemsPerSet;
    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);
    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    markInteraction();
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    markInteraction();
    setActiveIndex((prev) => prev + 1);
  };

  // After a move settles, if we've drifted into the first or last set,
  // silently jump to the equivalent index in the middle set so the track
  // never runs out of items. The jump is instant (duration 0) and lands on
  // a visually identical item, so the loop reads as seamless.
  const handleAnimationComplete = () => {
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setActiveIndex((prev) => prev + itemsPerSet);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setActiveIndex((prev) => prev - itemsPerSet);
    }
  };

  // Clear the reset flag once the instant jump has been applied.
  useEffect(() => {
    if (isResetting) setIsResetting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        markInteraction();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        markInteraction();
        setActiveIndex((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Auto-advance every 5s. Skips a tick if the user interacted within the
  // last 5s, so manual navigation isn't immediately overridden.
  useEffect(() => {
    const interval = setInterval(() => {
      if (isResetting) return;
      if (Date.now() - lastInteraction.current < 5000) return;
      setActiveIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isResetting]);

  // Center the active item. The track is anchored at the container's
  // horizontal center (left-1/2), so item i's center sits at
  // i*ITEM_WIDTH + ITEM_WIDTH/2 from the track start. Shift left by that
  // much to bring the active item's center to the middle.
  const targetX = -(activeIndex * ITEM_WIDTH + ITEM_WIDTH / 2);

  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative flex h-[200px] w-full flex-col justify-center">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>

        <div className="relative flex h-full w-full items-center overflow-hidden">
          <motion.div
            className="absolute left-1/2 top-1/2 flex -translate-y-1/2 items-center"
            style={{ gap: 0 }}
            animate={{ x: targetX }}
            transition={
              isResetting
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 28, mass: 1 }
            }
            onAnimationComplete={handleAnimationComplete}
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={item.key}
                  onClick={() => handleItemClick(index)}
                  className="flex shrink-0 cursor-pointer flex-col items-center justify-center"
                  style={{ width: `${ITEM_WIDTH}px` }}
                  animate={{
                    scale: isActive ? 1 : 0.7,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 25 }
                  }
                >
                  <span
                    className={`whitespace-nowrap font-heading text-4xl font-extrabold tracking-tight md:text-6xl ${
                      isActive ? "text-charcoal" : "text-charcoal/40 hover:text-charcoal/60"
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span
                      className={`mt-2 whitespace-nowrap font-body text-sm font-medium uppercase tracking-[0.18em] ${
                        isActive ? "text-crimson" : "text-charcoal/30"
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-100"
          aria-label="Previous service"
        >
          <Rewind className="h-5 w-5 text-crimson" />
        </button>

        <div className="flex items-center gap-2 tabular-nums">
          <span className="font-body text-sm font-medium text-charcoal/80">{currentPage}</span>
          <span className="font-body text-sm text-charcoal/40">/</span>
          <span className="font-body text-sm font-medium text-charcoal/80">{totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-100"
          aria-label="Next service"
        >
          <FastForward className="h-5 w-5 text-crimson" />
        </button>
      </div>
    </div>
  );
}
