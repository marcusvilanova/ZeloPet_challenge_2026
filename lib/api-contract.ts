export type ApiErrorShape = {
  message?: string;
  error?: string;
  errors?: Record<string, string>;
};

export function normalizeApiBaseUrl(value: string | undefined) {
  return (value ?? "http://localhost:8080").replace(/\/$/, "");
}

export function createAuthHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const FIELD_LABELS: Record<string, string> = {
  nome: "Nome",
  email: "E-mail",
  senha: "Senha",
  confirmarSenha: "Confirmação da senha",
  telefone: "Telefone",
  cidade: "Cidade",
  estado: "UF",
};

export function formatApiErrorMessage(status: number, payload: ApiErrorShape | null) {
  const fieldErrors = payload?.errors
    ? Object.entries(payload.errors).map(([field, message]) => `${FIELD_LABELS[field] ?? field}: ${message}`)
    : [];
  if (fieldErrors.length > 0) return fieldErrors.join("\n");
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;
  if (status === 401) return "E-mail ou senha inválidos.";
  if (status === 403) return "Você não possui permissão para esta ação.";
  if (status >= 500) return "O servidor não conseguiu concluir a solicitação. Tente novamente em instantes.";
  return "Não foi possível concluir a solicitação. Confira os dados e tente novamente.";
}
