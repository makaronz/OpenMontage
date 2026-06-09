"use client";

import { useEffect, useState } from "react";

type ReadinessRingProps = {
  percent: number | null;
  tone?: "primary" | "warn" | "danger" | "muted";
  size?: number;
  label?: string;
};

const STROKE = 8;
const TONE_STROKE: Record<NonNullable<ReadinessRingProps["tone"]>, string> = {
  primary: "var(--color-primary)",
  warn: "var(--color-warn)",
  danger: "var(--color-danger)",
  muted: "var(--color-muted)",
};

export function ReadinessRing({
  percent,
  tone = "primary",
  size = 120,
  label = "Readiness",
}: ReadinessRingProps) {
  const [animated, setAnimated] = useState(percent ?? 0);

  useEffect(() => {
    if (percent === null) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      const id = requestAnimationFrame(() => setAnimated(percent));
      return () => cancelAnimationFrame(id);
    }

    let innerId = 0;
    const outerId = requestAnimationFrame(() => {
      setAnimated(0);
      innerId = requestAnimationFrame(() => setAnimated(percent));
    });
    return () => {
      cancelAnimationFrame(outerId);
      cancelAnimationFrame(innerId);
    };
  }, [percent]);

  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = percent === null ? 0 : animated;
  const offset = circumference - (value / 100) * circumference;
  const stroke = TONE_STROKE[tone];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        percent === null
          ? `${label}: unavailable`
          : `${label}: ${percent} percent`
      }
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute text-2xl font-semibold tabular-nums text-[var(--color-text)]">
        {percent === null ? "—" : `${percent}%`}
      </span>
    </div>
  );
}
