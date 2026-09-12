import { describe, expect, it } from "vitest";

import { normalizeApiBaseUrl } from "../lib/api-contract";

describe("EXPO_PUBLIC_API_BASE_URL", () => {
  it("configura o endpoint local da API Java", () => {
    const baseUrl = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
    expect(baseUrl).toBe("http://localhost:8080");
    expect(new URL(`${baseUrl}/api/auth/me`).pathname).toBe("/api/auth/me");
  });
});
