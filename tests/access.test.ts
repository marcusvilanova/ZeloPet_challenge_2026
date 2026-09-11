import { describe, expect, it } from "vitest";

import { roleForEmail } from "../config/access";
import { tabsForRole } from "../config/navigation";

describe("controle de acesso por e-mail", () => {
  it("mostra somente as áreas do veterinário", () => {
    expect(roleForEmail("veterinario@zelo.com.br")).toBe("VETERINARIO");
    expect(tabsForRole("VETERINARIO").map((tab) => tab.route)).toEqual(["dashboard", "queue", "alertas"]);
  });

  it("mostra somente as áreas do gestor", () => {
    expect(roleForEmail("gestor@zelo.com.br")).toBe("GESTOR");
    expect(tabsForRole("GESTOR").map((tab) => tab.route)).toEqual(["dashboard", "queue", "alertas", "clinic"]);
  });

  it("considera qualquer outro e-mail como tutor", () => {
    expect(roleForEmail("qualquer@zelo.com.br")).toBe("TUTOR");
    expect(tabsForRole("TUTOR").map((tab) => tab.route)).toEqual(["dashboard", "pets", "triagens", "care"]);
  });
});
