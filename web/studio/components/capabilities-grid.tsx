import Link from "next/link";

import {
  capabilityProgress,
  formatCapabilityName,
  isCapabilityFullyConfigured,
  type CapabilityRow,
} from "@/lib/capabilities";

type SetupOffer = {
  capability?: string;
  tool?: string;
  provider?: string;
  install_instructions?: string;
};

type CapabilitiesGridProps = {
  capabilities: CapabilityRow[];
  setupOffers?: SetupOffer[];
};

function setupOfferForCapability(
  capability: string,
  offers: SetupOffer[],
): SetupOffer | undefined {
  return offers.find((offer) => offer.capability === capability);
}

export function CapabilitiesGrid({
  capabilities,
  setupOffers = [],
}: CapabilitiesGridProps) {
  if (capabilities.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        No capabilities returned from registry preflight.
      </p>
    );
  }

  const sorted = [...capabilities].sort((a, b) =>
    a.capability.localeCompare(b.capability),
  );

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((row) => {
        const progress = capabilityProgress(row);
        const complete = isCapabilityFullyConfigured(row);
        const offer = setupOfferForCapability(row.capability, setupOffers);

        return (
          <li
            key={row.capability}
            className="flex flex-col rounded-lg border border-white/10 bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">
                  {formatCapabilityName(row.capability)}
                </h3>
                <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                  {row.capability}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  complete
                    ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                    : "bg-amber-500/15 text-amber-200"
                }`}
              >
                {row.configured}/{row.total}
              </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {row.available_providers && row.available_providers.length > 0 ? (
              <p className="mt-3 text-xs text-[var(--color-muted)]">
                <span className="text-[var(--color-text)]">Available: </span>
                {row.available_providers.join(", ")}
              </p>
            ) : null}

            {row.unavailable_providers &&
            row.unavailable_providers.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                <span className="text-red-200/90">Needs setup: </span>
                {row.unavailable_providers.join(", ")}
              </p>
            ) : null}

            {offer?.install_instructions ? (
              <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">
                {offer.install_instructions}
              </p>
            ) : null}

            <div className="mt-auto pt-4">
              <Link
                href="/setup"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                Configure providers →
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
