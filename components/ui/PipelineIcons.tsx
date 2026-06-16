"use client";

/**
 * Custom-drawn SVG icons for the Business Intelligence pipeline steps.
 * Brand crimson, 1.75 stroke, animated accents. Sized to a 24px box via
 * the `className` passed from the consumer (default h-6 w-6).
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 32 32",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 01 — Connect your data: scattered sources funnelling into one hub. */
export function ConnectIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      {/* outer source nodes */}
      <circle cx="5" cy="6" r="2.4" />
      <circle cx="5" cy="16" r="2.4" />
      <circle cx="5" cy="26" r="2.4" />
      {/* converging links */}
      <path d="M7.4 6.6 21 14M7.4 16H19M7.4 25.4 21 18" opacity="0.5" />
      {/* central hub */}
      <circle cx="24" cy="16" r="4.2" className="fill-crimson/15" />
      <circle cx="24" cy="16" r="1.3" className="fill-crimson stroke-crimson">
        <animate
          attributeName="r"
          values="1.3;1.9;1.3"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/** 02 — Model & analyze: a processing chip with pins. */
export function ModelIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="9" y="9" width="14" height="14" rx="3" />
      {/* inner core */}
      <rect x="13.5" y="13.5" width="5" height="5" rx="1.2" className="fill-crimson/20" />
      {/* pins */}
      <path d="M13 9V5.5M19 9V5.5M13 23v3.5M19 23v3.5M9 13H5.5M9 19H5.5M23 13h3.5M23 19h3.5" />
      {/* pulse on the core */}
      <circle cx="16" cy="16" r="1" className="fill-crimson stroke-crimson">
        <animate
          attributeName="opacity"
          values="1;0.2;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/** 03 — Visualize live: rising bars with an animated trend line. */
export function VisualizeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      {/* axes */}
      <path d="M6 5v22h21" opacity="0.55" />
      {/* bars */}
      <rect x="10" y="18" width="3.4" height="9" rx="1" className="fill-crimson/25" />
      <rect x="16.3" y="14" width="3.4" height="13" rx="1" className="fill-crimson/40" />
      <rect x="22.6" y="9" width="3.4" height="18" rx="1" className="fill-crimson/60" />
      {/* trend line that draws itself */}
      <path d="M10 20 17 15 24 8" stroke="currentColor" strokeWidth="2" pathLength={1}>
        <animate
          attributeName="stroke-dashoffset"
          values="1;0"
          dur="2.2s"
          repeatCount="indefinite"
        />
        <set attributeName="stroke-dasharray" to="1 1" />
      </path>
    </svg>
  );
}

/** 04 — Decide & act: a target with a confirming check. */
export function DecideIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11" opacity="0.45" />
      <circle cx="16" cy="16" r="6.5">
        <animate
          attributeName="r"
          values="6.5;7.3;6.5"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </circle>
      {/* check at the bullseye */}
      <path
        d="M12.5 16.2 15 18.7 20 13.5"
        stroke="currentColor"
        strokeWidth="2.2"
        className="text-crimson"
      />
    </svg>
  );
}
