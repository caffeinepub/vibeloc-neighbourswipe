import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNeighbourhoodById } from "../data/neighbourhoodCatalog";
import { SwipeStorage } from "../services/swipeStorage";
import type { Neighbourhood } from "../types/neighbourhood";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useShortlist() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const storage = new SwipeStorage(actor, isAuthenticated);

  const shortlistQuery = useQuery({
    queryKey: ["shortlist", identity?.getPrincipal().toString()],
    queryFn: async () => {
      const ids = await storage.getLikedIds();
      return ids
        .map((id) => getNeighbourhoodById(id))
        .filter((n): n is Neighbourhood => n !== undefined);
    },
    staleTime: 2 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: (neighbourhoodId: number) => storage.addLike(neighbourhoodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (neighbourhoodId: number) =>
      storage.removeLike(neighbourhoodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => storage.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortlist"] });
    },
  });

  return {
    shortlist: shortlistQuery.data ?? [],
    isLoading: shortlistQuery.isLoading,
    addToShortlist: addMutation.mutateAsync,
    removeFromShortlist: removeMutation.mutateAsync,
    clearShortlist: clearMutation.mutateAsync,
  };
}

export function useSwipeFeed() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const storage = new SwipeStorage(actor, isAuthenticated);

  const swipedQuery = useQuery({
    queryKey: ["swipedIds", identity?.getPrincipal().toString()],
    queryFn: async () => {
      const likes = await storage.getLikedIds();
      const dislikes = storage.getDislikedIds();
      return [...likes, ...dislikes];
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    swipedIds: swipedQuery.data ?? [],
    isLoading: swipedQuery.isLoading,
  };
}
