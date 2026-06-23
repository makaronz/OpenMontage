import type { CapabilityRow } from "@/lib/capabilities";

export type ReadinessTone = "primary" | "warn" | "danger" | "muted";

export type ReadinessVerdict = {
  label: string;
  tone: ReadinessTone;
  pulse?: boolean;
  displayPercent: number | null;
};

export type ReadinessInputs = {
  apiOnline: boolean;
  preflightStatus: "warming" | "ready" | "error" | null;
  capabilities: CapabilityRow[];
  cachedRollupPercent: number | null;
};

export function capabilityRollupPercent(capabilities: CapabilityRow[]): number {
  let configured = 0;
  let total = 0;
  for (const row of capabilities) {
    configured += row.configured;
    total += row.total;
  }
  if (total === 0) return 0;
  return Math.round((configured / total) * 100);
}

export function providerToolsSummary(capabilities: CapabilityRow[]): {
  configured: number;
  total: number;
} {
  let configured = 0;
  let total = 0;
  for (const row of capabilities) {
    configured += row.configured;
    total += row.total;
  }
  return { configured, total };
}

export function readinessVerdict(input: ReadinessInputs): ReadinessVerdict {
  const rollup = capabilityRollupPercent(input.capabilities);
  const displayFromCache =
    input.preflightStatus === "warming" || input.preflightStatus === "error"
      ? input.cachedRollupPercent
      : null;
  const displayPercent =
    displayFromCache !== null && displayFromCache !== undefined
      ? displayFromCache
      : rollup;

  if (!input.apiOnline) {
    return {
      label: "Studio API offline",
      tone: "danger",
      displayPercent: displayPercent ?? null,
    };
  }

  if (input.preflightStatus === null) {
    return {
      label: "Preflight unavailable",
      tone: "warn",
      displayPercent: null,
    };
  }

  if (input.preflightStatus === "warming") {
    return {
      label: "Warming registry…",
      tone: "warn",
      pulse: true,
      displayPercent: displayPercent ?? null,
    };
  }

  if (input.preflightStatus === "error") {
    return {
      label: "Preflight failed",
      tone: "danger",
      displayPercent: displayPercent ?? null,
    };
  }

  const totalTools = input.capabilities.reduce((sum, row) => sum + row.total, 0);
  if (totalTools === 0) {
    return {
      label: "No capabilities registered",
      tone: "muted",
      displayPercent: 0,
    };
  }

  if (rollup >= 90) {
    return { label: "Ready to produce", tone: "primary", displayPercent: rollup };
  }
  if (rollup >= 50) {
    return { label: "Almost ready", tone: "warn", displayPercent: rollup };
  }
  return { label: "Action required", tone: "danger", displayPercent: rollup };
}

export function toneClass(tone: ReadinessTone): string {
  switch (tone) {
    case "primary":
      return "text-[var(--color-primary)]";
    case "warn":
      return "text-[var(--color-warn)]";
    case "danger":
      return "text-[var(--color-danger)]";
    default:
      return "text-[var(--color-muted)]";
  }
}

export function toneBadgeClass(tone: ReadinessTone): string {
  switch (tone) {
    case "primary":
      return "bg-[var(--color-primary)]/15 text-[var(--color-primary)]";
    case "warn":
      return "bg-[var(--color-warn)]/15 text-[var(--color-warn)]";
    case "danger":
      return "bg-[var(--color-danger)]/15 text-[var(--color-danger)]";
    default:
      return "bg-white/10 text-[var(--color-muted)]";
  }
}
