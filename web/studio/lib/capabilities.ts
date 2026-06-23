export type CapabilityRow = {
  capability: string;
  configured: number;
  total: number;
  available_providers?: string[];
  unavailable_providers?: string[];
};

export function formatCapabilityName(id: string): string {
  return id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function capabilityProgress(row: CapabilityRow): number {
  if (!row.total) return 0;
  return Math.round((row.configured / row.total) * 100);
}

export function isCapabilityFullyConfigured(row: CapabilityRow): boolean {
  return row.total > 0 && row.configured >= row.total;
}
