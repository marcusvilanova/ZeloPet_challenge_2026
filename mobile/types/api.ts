export type UserRole = "TUTOR" | "VETERINARIO" | "GESTOR";

export interface ZeloUser {
  id: number;
  nome: string;
  email: string;
  tipo: UserRole;
  telefone?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export interface AuthSession {
  token: string;
  usuario: ZeloUser;
}

export type PetSpecies = "CAO" | "GATO" | "OUTRO";
export type PetSex = "M" | "F" | "I";

export interface Pet {
  id: number;
  nome: string;
  especie: PetSpecies;
  raca?: string | null;
  sexo?: PetSex | null;
  dataNascimento?: string | null;
  pesoKg?: number | null;
  castrado?: boolean | null;
}

export interface PetInput {
  nome: string;
  especie: PetSpecies;
  raca?: string;
  sexo?: PetSex;
  dataNascimento?: string;
  pesoKg?: number;
  castrado?: boolean;
}

export type TriageChannel = "TEXTO" | "AUDIO" | "IMAGEM";
export type TriageUrgency = "BAIXA" | "MEDIA" | "ALTA" | "EMERGENCIA";
export type TriageStatus = "ABERTA" | "ENCAMINHADA" | "ATENDIDA" | "CANCELADA";

export interface Triage {
  id: number;
  petId: number;
  petNome?: string | null;
  clinicaNome?: string | null;
  canal: TriageChannel;
  relato: string;
  scoreRisco: number;
  urgencia: TriageUrgency;
  analiseVisual?: string | null;
  status: TriageStatus;
  criadaEm: string;
}

export interface TriageInput {
  petId: number;
  clinicaId?: number;
  canal: TriageChannel;
  relato: string;
}

export type AlertType = "VACINA" | "CHECKUP" | "RETENCAO" | "POS_CONSULTA";
export type AlertStatus = "PENDENTE" | "ENVIADO" | "CONCLUIDO" | "CANCELADO";

export interface CareAlert {
  id: number;
  petId: number;
  petNome?: string | null;
  clinicaNome?: string | null;
  tipo: AlertType;
  titulo: string;
  descricao?: string | null;
  dataPrevista: string;
  status: AlertStatus;
}

export interface AlertInput {
  petId: number;
  tipo: AlertType;
  titulo: string;
  descricao?: string;
  dataPrevista: string;
}

export interface Clinic {
  id: number;
  nome: string;
  cidade?: string | null;
  estado?: string | null;
}

export interface ClinicInput {
  nome: string;
  cnpj?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

export interface ApiErrorPayload {
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}
