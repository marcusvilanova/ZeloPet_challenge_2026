import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import type {
  AlertInput,
  ApiErrorPayload,
  AuthSession,
  CareAlert,
  Clinic,
  ClinicInput,
  Pet,
  PetInput,
  Triage,
  TriageInput,
  ZeloUser,
} from "@/types/api";
import { createAuthHeaders, formatApiErrorMessage, normalizeApiBaseUrl } from "@/lib/api-contract";

const TOKEN_KEY = "zelo.auth.token";
const SESSION_KEY = "zelo.auth.session";

const defaultApiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";
export const API_BASE_URL = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiUrl);

async function storageGet(key: string) {
  if (Platform.OS === "web") return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function storageSet(key: string, value: string) {
  if (Platform.OS === "web") return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

async function storageRemove(key: string) {
  if (Platform.OS === "web") return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export async function getStoredSession(): Promise<AuthSession | null> {
  const raw = await storageGet(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    await clearStoredSession();
    return null;
  }
}

export async function storeSession(session: AuthSession) {
  await Promise.all([
    storageSet(TOKEN_KEY, session.token),
    storageSet(SESSION_KEY, JSON.stringify(session)),
  ]);
}

export async function clearStoredSession() {
  await Promise.all([storageRemove(TOKEN_KEY), storageRemove(SESSION_KEY)]);
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = await storageGet(TOKEN_KEY);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  Object.entries(createAuthHeaders(token)).forEach(([name, value]) => headers.set(name, value));

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error(`Não foi possível conectar à API Java em ${API_BASE_URL}. Inicie o backend na porta 8080 e confira se o app está sendo executado no mesmo computador, ou configure o IP da máquina na URL da API.`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  const rawBody = await response.text();
  let payload: T | ApiErrorPayload | null = null;
  if (rawBody) {
    if (contentType.includes("application/json")) {
      try {
        payload = JSON.parse(rawBody) as T | ApiErrorPayload;
      } catch {
        payload = { message: "A API retornou uma resposta inválida." };
      }
    } else if (!response.ok) {
      const message = rawBody.match(/<[^>]*(?:mensagem|message)[^>]*>\s*([^<]+)/i)?.[1]?.trim();
      payload = { message: message || "A API Java retornou uma página de erro. Reinicie o backend com a versão integrada ao app." };
    }
  }

  if (!response.ok) {
    if (response.status === 401) await clearStoredSession();
    throw new Error(formatApiErrorMessage(response.status, payload as ApiErrorPayload | null));
  }

  return payload as T;
}

export const api = {
  async login(email: string, senha: string) {
    return request<AuthSession>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  },

  async register(input: {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
  }) {
    return request<AuthSession>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  me() {
    return request<ZeloUser>("/api/auth/me");
  },

  pets: {
    list: () => request<Pet[]>("/api/pets"),
    get: (id: number) => request<Pet>(`/api/pets/${id}`),
    create: (input: PetInput) =>
      request<Pet>("/api/pets", { method: "POST", body: JSON.stringify(input) }),
    update: (id: number, input: PetInput) =>
      request<Pet>(`/api/pets/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    remove: (id: number) =>
      request<void>(`/api/pets/${id}`, { method: "DELETE" }),
  },

  triagens: {
    list: () => request<Triage[]>("/api/triagens"),
    get: (id: number) => request<Triage>(`/api/triagens/${id}`),
    create: (input: TriageInput) =>
      request<Triage>("/api/triagens", { method: "POST", body: JSON.stringify(input) }),
    cancel: (id: number) =>
      request<Triage>(`/api/triagens/${id}/cancelar`, { method: "PATCH" }),
    remove: (id: number) => request<void>(`/api/triagens/${id}`, { method: "DELETE" }),
  },

  alertas: {
    list: () => request<CareAlert[]>("/api/alertas"),
    create: (input: AlertInput) =>
      request<CareAlert>("/api/alertas", { method: "POST", body: JSON.stringify(input) }),
    confirm: (id: number) =>
      request<CareAlert>(`/api/alertas/${id}/confirmar`, { method: "PATCH" }),
    cancel: (id: number) =>
      request<CareAlert>(`/api/alertas/${id}/cancelar`, { method: "PATCH" }),
    remove: (id: number) => request<void>(`/api/alertas/${id}`, { method: "DELETE" }),
  },

  clinics: {
    list: () => request<Clinic[]>("/api/clinicas"),
    mine: () => request<Clinic>("/api/clinicas/minha"),
    update: (id: number, input: ClinicInput) => request<Clinic>(`/api/clinicas/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  },
};
