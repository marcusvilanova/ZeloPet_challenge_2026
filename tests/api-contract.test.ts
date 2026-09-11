import { describe, expect, it } from "vitest";

import { formatApiErrorMessage } from "../lib/api-contract";

describe("mensagens de erro da API", () => {
  it("mostra os campos inválidos com rótulos humanos", () => {
    expect(formatApiErrorMessage(400, { message: "Revise os campos", errors: { email: "Informe um e-mail válido." } }))
      .toBe("E-mail: Informe um e-mail válido.");
  });

  it("explica credenciais inválidas", () => {
    expect(formatApiErrorMessage(401, null)).toBe("E-mail ou senha inválidos.");
  });

  it("orienta quando o servidor está indisponível", () => {
    expect(formatApiErrorMessage(500, null)).toContain("servidor");
  });

  it("orienta quando o backend não foi reiniciado com a API REST nova", () => {
    expect(formatApiErrorMessage(400, { message: "A API Java retornou uma página de erro. Reinicie o backend com a versão integrada ao app." }))
      .toContain("Reinicie o backend");
  });
});
