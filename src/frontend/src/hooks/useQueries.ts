import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PulsePost,
  PulsePostInput,
  SpaceListingInput,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useListingsByNeighbourhood(neighbourhoodName: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ["listings", "neighbourhood", neighbourhoodName],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getListingsByNeighbourhood(neighbourhoodName);
    },
    enabled: !!actor && !actorFetching && !!neighbourhoodName,
  });
}

export function usePostSpaceListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SpaceListingInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postSpaceListing(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function usePostPulse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PulsePostInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postPulse(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulses"] });
    },
  });
}

export function usePulsesByNeighbourhood(neighbourhoodName: string) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<PulsePost[]>({
    queryKey: ["pulses", "neighbourhood", neighbourhoodName],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPulsesByNeighbourhood(neighbourhoodName);
    },
    enabled: !!actor && !actorFetching && !!neighbourhoodName,
  });
}
