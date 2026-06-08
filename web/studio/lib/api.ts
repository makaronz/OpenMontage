const DEFAULT_STUDIO_API_URL = "http://127.0.0.1:8000";

export function studioApiBase(): string {
  return process.env.STUDIO_API_URL ?? DEFAULT_STUDIO_API_URL;
}

export type HealthResponse = {
  status: string;
  repo_root: string;
};

export type PreflightSummaryPayload = {
  composition_runtimes?: Record<string, boolean>;
  capabilities?: Array<Record<string, unknown>>;
  setup_offers?: Array<Record<string, unknown>>;
  runtime_warnings?: string[];
};

export type PreflightResponse = {
  status: "warming" | "ready" | "error";
  elapsed_ms?: number;
  warmup_ms?: number;
  summary?: PreflightSummaryPayload;
  error?: string;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${studioApiBase()}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function fetchHealth(): Promise<HealthResponse | null> {
  return fetchJson<HealthResponse>("/api/health");
}

export function fetchPreflightSummary(): Promise<PreflightResponse | null> {
  return fetchJson<PreflightResponse>("/api/preflight/summary");
}
