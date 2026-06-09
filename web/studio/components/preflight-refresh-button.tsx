"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { postPreflightRun, studioApiBase } from "@/lib/api";

type PreflightRefreshButtonProps = {
  disabled?: boolean;
  className?: string;
};

export function PreflightRefreshButton({
  disabled = false,
  className = "",
}: PreflightRefreshButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRefresh() {
    setPending(true);
    setError(null);
    try {
      const result = await postPreflightRun();
      if (!result) {
        setError(`Studio API unreachable at ${studioApiBase()}`);
        return;
      }
      if (result.status === "error") {
        setError(result.error ?? "Preflight refresh failed");
      }
      router.refresh();
    } catch {
      setError("Refresh failed — try again");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled || pending}
        aria-busy={pending}
        onClick={() => void handleRefresh()}
        className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        {pending ? (
          <>
            <Loader2
              className="mr-2 inline size-4 animate-spin motion-reduce:animate-none"
              aria-hidden
            />
            Refreshing preflight…
          </>
        ) : (
          "Refresh preflight"
        )}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p>
      ) : null}
    </div>
  );
}
