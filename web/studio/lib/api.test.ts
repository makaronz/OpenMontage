import { afterEach, describe, expect, it, vi } from "vitest";

import { studioApiBase } from "./api";

describe("studioApiBase", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the public API URL for browser-side calls", () => {
    vi.stubEnv("NEXT_PUBLIC_STUDIO_API_URL", "https://studio-api.example");

    expect(studioApiBase()).toBe("https://studio-api.example");
  });

  it("prefers the public API URL when both server and public URLs are set", () => {
    vi.stubEnv("STUDIO_API_URL", "https://server-only.example");
    vi.stubEnv("NEXT_PUBLIC_STUDIO_API_URL", "https://browser.example");

    expect(studioApiBase()).toBe("https://browser.example");
  });
});
