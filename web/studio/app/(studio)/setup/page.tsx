import { SetupEnvEditor } from "@/components/setup-env-editor";
import { PreflightRefreshButton } from "@/components/preflight-refresh-button";
import { fetchHealth } from "@/lib/api";

export default async function SetupPage() {
  const health = await fetchHealth();
  const apiOnline = health?.status === "ok";
  const envPath = health?.repo_root
    ? `${health.repo_root}/.env`
    : "<repo>/.env";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Phase 1
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Setup</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Provider key helper ported from{" "}
            <code className="font-mono text-xs">provider-key-links.html</code>.
            Copy lines into your local{" "}
            <code className="font-mono text-xs">.env</code> — nothing is saved
            from the browser.
          </p>
        </div>
        <PreflightRefreshButton disabled={!apiOnline} />
      </div>

      <SetupEnvEditor envPath={envPath} />
    </div>
  );
}
