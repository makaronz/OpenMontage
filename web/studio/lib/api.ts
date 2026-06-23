const DEFAULT_STUDIO_API_URL = "http://127.0.0.1:8000";

export function studioApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_STUDIO_API_URL ??
    process.env.STUDIO_API_URL ??
    DEFAULT_STUDIO_API_URL
  );
}

export type HealthResponse = {
  status: string;
  repo_root: string;
};

export type CapabilityRow = {
  capability: string;
  configured: number;
  total: number;
  available_providers?: string[];
  unavailable_providers?: string[];
};

export type SetupOffer = {
  capability?: string;
  tool?: string;
  provider?: string;
  install_instructions?: string;
};

export type PreflightSummaryPayload = {
  composition_runtimes?: Record<string, boolean>;
  capabilities?: CapabilityRow[];
  setup_offers?: SetupOffer[];
  runtime_warnings?: string[];
};

export type PreflightResponse = {
  status: "warming" | "ready" | "error";
  elapsed_ms?: number;
  warmup_ms?: number;
  summary?: PreflightSummaryPayload;
  error?: string;
};

export type CapabilitiesCatalogResponse = {
  status: "warming" | "ready" | "error";
  catalog?: Record<string, Array<Record<string, unknown>>> | null;
};

async function fetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const response = await fetch(`${studioApiBase()}${path}`, {
      cache: "no-store",
      ...init,
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

export function fetchCapabilitiesCatalog(): Promise<CapabilitiesCatalogResponse | null> {
  return fetchJson<CapabilitiesCatalogResponse>("/api/capabilities/catalog");
}

export function postPreflightRun(): Promise<PreflightResponse | null> {
  return fetchJson<PreflightResponse>("/api/preflight/run", {
    method: "POST",
  });
}
