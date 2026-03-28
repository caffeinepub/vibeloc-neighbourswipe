import { useMemo, useState } from "react";
import { toast } from "sonner";
import DiscoverEmptyState from "../components/discover/DiscoverEmptyState";
import SwipeDeck from "../components/discover/SwipeDeck";
import { usePreferences } from "../hooks/usePreferences";
import { useShortlist, useSwipeFeed } from "../hooks/useShortlist";
import { getScoredRecommendations } from "../services/recommendations";
import type { Neighbourhood } from "../types/neighbourhood";

const ZONES = [
  "All",
  "Pop Up Cities",
  "CBD Core",
  "Waiyaki Way",
  "Northern Heights",
  "Ngong Road",
  "Thika Road",
  "Southern Corridor",
  "Langata Belt",
  "Eastlands",
  "Kiambu Belt",
  "Kajiado Belt",
  "Eastern Bypass",
];

export default function DiscoverPage() {
  const { preferences, isLoadingOnboarding } = usePreferences();
  const { addToShortlist, clearShortlist } = useShortlist();
  const { swipedIds, isLoading: isLoadingSwipes } = useSwipeFeed();
  const [selectedZone, setSelectedZone] = useState("All");

  const scoredRecommendations = useMemo(
    () => getScoredRecommendations(preferences ?? null, swipedIds),
    [preferences, swipedIds],
  );

  const filteredRecommendations = useMemo(() => {
    if (selectedZone === "All") return scoredRecommendations;
    return scoredRecommendations.filter(
      (item) => item.neighbourhood.zone === selectedZone,
    );
  }, [scoredRecommendations, selectedZone]);

  const recommendations = filteredRecommendations.map(
    (item) => item.neighbourhood,
  );

  const matchReasonsByIndex = useMemo(() => {
    const result: Record<number, string[]> = {};
    filteredRecommendations.forEach((item, idx) => {
      if (item.matchReasons.length > 0) {
        result[idx] = item.matchReasons;
      }
    });
    return result;
  }, [filteredRecommendations]);

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

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold">Discover Neighbourhoods</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Swipe cards or tap the buttons below
        </p>
      </div>

      {/* Zone filter tabs */}
      <div className="mb-4 -mx-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-1" style={{ minWidth: "max-content" }}>
          {ZONES.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setSelectedZone(zone)}
              data-ocid={`discover.${zone.toLowerCase().replace(/[^a-z0-9]/g, "-")}.tab`}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedZone === zone
                  ? zone === "Pop Up Cities"
                    ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    : "bg-primary text-primary-foreground"
                  : zone === "Pop Up Cities"
                    ? "border border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "border border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {zone === "Pop Up Cities" ? "⚡ Pop Up Cities" : zone}
            </button>
          ))}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <DiscoverEmptyState onReset={handleReset} />
      ) : (
        <SwipeDeck
          neighbourhoods={recommendations}
          onLike={handleLike}
          onDislike={handleDislike}
          matchReasonsByIndex={matchReasonsByIndex}
        />
      )}
    </div>
  );
}
