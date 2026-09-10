import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { AlertInput, PetInput, TriageInput } from "@/types/api";

export const queryKeys = {
  pets: ["pets"] as const,
  pet: (id: number) => ["pets", id] as const,
  triagens: ["triagens"] as const,
  triagem: (id: number) => ["triagens", id] as const,
  alertas: ["alertas"] as const,
  clinicas: ["clinicas"] as const,
};

export function usePets() {
  return useQuery({ queryKey: queryKeys.pets, queryFn: api.pets.list });
}

export function usePet(id: number) {
  return useQuery({ queryKey: queryKeys.pet(id), queryFn: () => api.pets.get(id), enabled: id > 0 });
}

export function useCreatePet() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: PetInput) => api.pets.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.pets }),
  });
}

export function useUpdatePet(id: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: PetInput) => api.pets.update(id, input),
    onSuccess: (pet) => {
      client.setQueryData(queryKeys.pet(id), pet);
      client.invalidateQueries({ queryKey: queryKeys.pets });
    },
  });
}

export function useDeletePet() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.pets.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.pets }),
  });
}

export function useTriagens() {
  return useQuery({ queryKey: queryKeys.triagens, queryFn: api.triagens.list });
}

export function useCreateTriagem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: TriageInput) => api.triagens.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.triagens }),
  });
}

export function useCancelTriagem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.triagens.cancel(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.triagens }),
  });
}

export function useDeleteTriagem() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.triagens.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.triagens }),
  });
}

export function useAlertas() {
  return useQuery({ queryKey: queryKeys.alertas, queryFn: api.alertas.list });
}

export function useCreateAlerta() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: AlertInput) => api.alertas.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.alertas }),
  });
}

export function useConfirmAlerta() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.alertas.confirm(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.alertas }),
  });
}

export function useCancelAlerta() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.alertas.cancel(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.alertas }),
  });
}

export function useDeleteAlerta() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.alertas.remove(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.alertas }),
  });
}

export function useClinicas() {
  return useQuery({ queryKey: queryKeys.clinicas, queryFn: api.clinics.list });
}

export function useMyClinic() {
  return useQuery({ queryKey: [...queryKeys.clinicas, "mine"], queryFn: api.clinics.mine });
}

export function useUpdateClinic() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Parameters<typeof api.clinics.update>[1] }) => api.clinics.update(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.clinicas }),
  });
}
