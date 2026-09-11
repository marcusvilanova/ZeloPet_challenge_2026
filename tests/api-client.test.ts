import { describe, expect, it } from "vitest";

import { createAuthHeaders, normalizeApiBaseUrl } from "../lib/api-contract";

describe("cliente REST do Zelo", () => {
  it("normaliza a URL base sem barra final", () => {
    expect(normalizeApiBaseUrl("https://api.exemplo.com/"))
      .toBe("https://api.exemplo.com");
    expect(normalizeApiBaseUrl(undefined)).toBe("http://localhost:8080");
  });

  it("envia Bearer somente quando existe sessão", () => {
    expect(createAuthHeaders("token-real"))
      .toEqual({ Authorization: "Bearer token-real" });
    expect(createAuthHeaders(null)).toEqual({});
  });
});
