import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import DiscoverEmptyState from "../components/discover/DiscoverEmptyState";
import SwipeDeck from "../components/discover/SwipeDeck";
import { usePreferences } from "../hooks/usePreferences";
import { useShortlist, useSwipeFeed } from "../hooks/useShortlist";
import { getScoredRecommendations } from "../services/recommendations";
import type { Neighbourhood } from "../types/neighbourhood";

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { preferences, onboardingComplete, isLoadingOnboarding } =
    usePreferences();
  const { addToShortlist, clearShortlist } = useShortlist();
  const { swipedIds, isLoading: isLoadingSwipes } = useSwipeFeed();

  useEffect(() => {
    if (!isLoadingOnboarding && !onboardingComplete) {
      navigate({ to: "/onboarding" });
    }
  }, [onboardingComplete, isLoadingOnboarding, navigate]);

  const scoredRecommendations = useMemo(
    () => getScoredRecommendations(preferences ?? null, swipedIds),
    [preferences, swipedIds],
  );

  const recommendations = scoredRecommendations.map(
    (item) => item.neighbourhood,
  );

  const matchReasonsByIndex = useMemo(() => {
    const result: Record<number, string[]> = {};
    scoredRecommendations.forEach((item, idx) => {
      if (item.matchReasons.length > 0) {
        result[idx] = item.matchReasons;
      }
    });
    return result;
  }, [scoredRecommendations]);

  const handleLike = async (neighbourhood: Neighbourhood) => {
    try {
      await addToShortlist(neighbourhood.id);
      toast.success(`${neighbourhood.name} added to shortlist!`);
    } catch (error) {
      toast.error("Failed to add to shortlist");
      console.error(error);
    }
  };

  const handleDislike = (_neighbourhood: Neighbourhood) => {
    // Dislike handled by swipe storage automatically
  };

  const handleReset = async () => {
    try {
      await clearShortlist();
      toast.success("Swipes reset! Start fresh.");
    } catch (error) {
      toast.error("Failed to reset swipes");
      console.error(error);
    }
  };

  if (isLoadingOnboarding || isLoadingSwipes) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading neighbourhoods...
          </p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <DiscoverEmptyState onReset={handleReset} />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold">Discover Neighbourhoods</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Swipe cards or tap the buttons below
        </p>
      </div>
      <SwipeDeck
        neighbourhoods={recommendations}
        onLike={handleLike}
        onDislike={handleDislike}
        matchReasonsByIndex={matchReasonsByIndex}
      />
    </div>
  );
}
