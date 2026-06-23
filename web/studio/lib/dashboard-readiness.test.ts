import { describe, expect, it } from "vitest";

import {
  capabilityRollupPercent,
  providerToolsSummary,
  readinessVerdict,
  type ReadinessInputs,
} from "./dashboard-readiness";

describe("capabilityRollupPercent", () => {
  it("returns 0 when no capabilities", () => {
    expect(capabilityRollupPercent([])).toBe(0);
  });

  it("returns rounded configured/total ratio", () => {
    expect(
      capabilityRollupPercent([
        { capability: "a", configured: 1, total: 2 },
        { capability: "b", configured: 2, total: 2 },
      ]),
    ).toBe(75);
  });
});

describe("readinessVerdict", () => {
  const base: ReadinessInputs = {
    apiOnline: true,
    preflightStatus: "ready",
    capabilities: [{ capability: "x", configured: 9, total: 10 }],
    cachedRollupPercent: null,
  };

  it("api offline", () => {
    const v = readinessVerdict({ ...base, apiOnline: false });
    expect(v.label).toBe("Studio API offline");
    expect(v.tone).toBe("danger");
  });

  it("preflight null", () => {
    const v = readinessVerdict({ ...base, preflightStatus: null });
    expect(v.label).toBe("Preflight unavailable");
    expect(v.tone).toBe("warn");
  });

  it("warming uses cached rollup when present", () => {
    const v = readinessVerdict({
      ...base,
      preflightStatus: "warming",
      cachedRollupPercent: 80,
    });
    expect(v.label).toBe("Warming registry…");
    expect(v.pulse).toBe(true);
    expect(v.displayPercent).toBe(80);
  });

  it("ready at 90%+ is primary", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 9, total: 10 }],
    });
    expect(v.label).toBe("Ready to produce");
    expect(v.tone).toBe("primary");
  });

  it("50–89% is almost ready", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 6, total: 10 }],
    });
    expect(v.label).toBe("Almost ready");
    expect(v.tone).toBe("warn");
  });

  it("<50% is action required", () => {
    const v = readinessVerdict({
      ...base,
      capabilities: [{ capability: "x", configured: 2, total: 10 }],
    });
    expect(v.label).toBe("Action required");
    expect(v.tone).toBe("danger");
  });
});

describe("providerToolsSummary", () => {
  it("sums configured and total across capabilities", () => {
    expect(
      providerToolsSummary([
        { capability: "a", configured: 1, total: 3 },
        { capability: "b", configured: 2, total: 2 },
      ]),
    ).toEqual({ configured: 3, total: 5 });
  });
});
