import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { RenterPreferences } from '../types/preferences';
import { PreferencesStorage } from '../services/preferencesStorage';

export function usePreferences() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const storage = new PreferencesStorage(actor, isAuthenticated);

  const preferencesQuery = useQuery({
    queryKey: ['preferences', identity?.getPrincipal().toString()],
    queryFn: () => storage.getPreferences(),
    staleTime: 5 * 60 * 1000,
  });

  const onboardingQuery = useQuery({
    queryKey: ['onboardingComplete', identity?.getPrincipal().toString()],
    queryFn: () => storage.getOnboardingComplete(),
    staleTime: 5 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (preferences: RenterPreferences) => {
      await storage.savePreferences(preferences);
      storage.setLocalOnboardingComplete(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['onboardingComplete'] });
    },
  });

  return {
    preferences: preferencesQuery.data,
    isLoadingPreferences: preferencesQuery.isLoading,
    onboardingComplete: onboardingQuery.data ?? false,
    isLoadingOnboarding: onboardingQuery.isLoading,
    savePreferences: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}
