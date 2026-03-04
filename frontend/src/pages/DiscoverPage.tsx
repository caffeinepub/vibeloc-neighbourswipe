import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../hooks/usePreferences';
import { useShortlist, useSwipeFeed } from '../hooks/useShortlist';
import { getRecommendations } from '../services/recommendations';
import SwipeDeck from '../components/discover/SwipeDeck';
import DiscoverEmptyState from '../components/discover/DiscoverEmptyState';
import { Neighbourhood } from '../types/neighbourhood';
import { toast } from 'sonner';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { preferences, onboardingComplete, isLoadingOnboarding } = usePreferences();
  const { addToShortlist, clearShortlist } = useShortlist();
  const { swipedIds, isLoading: isLoadingSwipes } = useSwipeFeed();

  useEffect(() => {
    if (!isLoadingOnboarding && !onboardingComplete) {
      navigate({ to: '/onboarding' });
    }
  }, [onboardingComplete, isLoadingOnboarding, navigate]);

  const recommendations = getRecommendations(preferences ?? null, swipedIds);

  const handleLike = async (neighbourhood: Neighbourhood) => {
    try {
      await addToShortlist(neighbourhood.id);
      toast.success(`${neighbourhood.name} added to shortlist!`);
    } catch (error) {
      toast.error('Failed to add to shortlist');
      console.error(error);
    }
  };

  const handleDislike = (neighbourhood: Neighbourhood) => {
    // Dislike is handled by the swipe storage automatically
  };

  const handleReset = async () => {
    try {
      await clearShortlist();
      toast.success('Swipes reset! Start fresh.');
    } catch (error) {
      toast.error('Failed to reset swipes');
      console.error(error);
    }
  };

  if (isLoadingOnboarding || isLoadingSwipes) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading neighbourhoods...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <DiscoverEmptyState onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Discover Neighbourhoods</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Swipe right to like, left to pass
        </p>
      </div>
      <SwipeDeck
        neighbourhoods={recommendations}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </div>
  );
}
