import Link from "next/link";
import { KeyRound } from "lucide-react";

import type { SetupOffer } from "@/lib/api";
import { formatCapabilityName } from "@/lib/capabilities";

type DashboardBlockersProps = {
  setupOffers: SetupOffer[];
  rollupPercent: number;
  maxItems?: number;
};

function offerTitle(offer: SetupOffer): string {
  const cap = offer.capability
    ? formatCapabilityName(offer.capability)
    : "Unknown capability";
  const tool = offer.tool ?? offer.provider ?? "tool";
  return `${cap} · ${tool}`;
}

export function DashboardBlockers({
  setupOffers,
  rollupPercent,
  maxItems = 5,
}: DashboardBlockersProps) {
  const items = setupOffers.slice(0, maxItems);
  const hasOverflow = setupOffers.length > maxItems;

  if (items.length === 0) {
    if (rollupPercent < 100) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-muted)]">
            No setup hints from registry.
          </p>
          <Link
            href="/setup"
            className="inline-flex min-h-11 items-center text-sm text-[var(--color-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Open provider setup
          </Link>
        </div>
      );
    }

    return (
      <p className="text-sm text-[var(--color-muted)]">
        All provider slots configured.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((offer, index) => {
          const slug = offer.capability ?? "";
          const href = slug
            ? `/setup?capability=${encodeURIComponent(slug)}`
            : "/setup";
          return (
            <li key={`${slug}-${offer.tool ?? index}`}>
              <Link
                href={href}
                className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-[var(--color-text)]">
                    {offerTitle(offer)}
                  </span>
                  {offer.install_instructions ? (
                    <span className="mt-0.5 line-clamp-2 text-xs text-[var(--color-muted)]">
                      {offer.install_instructions}
                    </span>
                  ) : null}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--color-warn)]">
                  <KeyRound className="size-3.5" aria-hidden />
                  Fix in Setup
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {hasOverflow ? (
        <Link
          href="/capabilities"
          className="inline-flex min-h-11 items-center text-xs text-[var(--color-primary)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          View all blockers on Capabilities
        </Link>
      ) : null}
    </div>
  );
}
