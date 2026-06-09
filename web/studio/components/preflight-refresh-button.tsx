"use client";

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
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={disabled || pending}
        onClick={() => void handleRefresh()}
        className="rounded-md border border-white/15 px-3 py-2 text-sm text-[var(--color-text)] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Refreshing preflight…" : "Refresh preflight"}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-red-300">{error}</p>
      ) : null}
    </div>
  );
}
