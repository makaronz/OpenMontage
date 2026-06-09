import { CapabilitiesGrid } from "@/components/capabilities-grid";
import { CompositionRuntimeChips } from "@/components/composition-runtime-chips";
import { PreflightRefreshButton } from "@/components/preflight-refresh-button";
import { fetchHealth, fetchPreflightSummary } from "@/lib/api";

export default async function CapabilitiesPage() {
  const [health, preflight] = await Promise.all([
    fetchHealth(),
    fetchPreflightSummary(),
  ]);

  const apiOnline = health?.status === "ok";
  const summary = preflight?.summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Phase 1
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Capabilities</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Registry rollup: configured vs total tool slots per capability,
            matching CLI preflight output.
          </p>
        </div>
        <PreflightRefreshButton disabled={!apiOnline} />
      </div>

      {!apiOnline ? (
        <p className="text-sm text-[var(--color-muted)]">
          Start <code className="font-mono text-xs">make studio-api</code> to
          load capabilities.
        </p>
      ) : preflight?.status === "warming" ? (
        <p className="text-sm text-[var(--color-muted)]">
          Registry is still warming. Refresh in a moment or use Refresh preflight.
        </p>
      ) : preflight?.status === "error" ? (
        <p className="font-mono text-sm text-red-300">{preflight.error}</p>
      ) : (
        <>
          <section className="rounded-lg border border-white/10 bg-[var(--color-surface)] p-4">
            <h3 className="text-sm font-semibold">Composition runtimes</h3>
            <div className="mt-3">
              <CompositionRuntimeChips
                runtimes={summary?.composition_runtimes ?? {}}
              />
            </div>
          </section>

          <CapabilitiesGrid
            capabilities={summary?.capabilities ?? []}
            setupOffers={summary?.setup_offers}
          />
        </>
      )}
    </div>
  );
}
