import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useAdminListings() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["adminListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !actorFetching,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminListings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });

  return {
    listings: query.data ?? [],
    isLoading: actorFetching || query.isLoading,
    isError: query.isError,
    deleteListing: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
