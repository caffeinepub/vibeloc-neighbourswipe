import { NAIROBI_NEIGHBOURHOODS } from "../data/neighbourhoodCatalog";
import type { Neighbourhood } from "../types/neighbourhood";
import type { RenterPreferences } from "../types/preferences";

export function scoreNeighbourhood(
  neighbourhood: Neighbourhood,
  preferences: RenterPreferences,
): number {
  let score = 0;

  // Budget fit (40% weight)
  const rentMid = (neighbourhood.rentMin + neighbourhood.rentMax) / 2;
  const budgetMid = (preferences.budgetMin + preferences.budgetMax) / 2;
  const budgetDiff = Math.abs(rentMid - budgetMid);
  const budgetScore = Math.max(0, 100 - (budgetDiff / budgetMid) * 100);
  score += budgetScore * 0.4;

  // Lifestyle tag overlap (40% weight)
  const matchingTags = neighbourhood.tags.filter((tag) =>
    preferences.lifestyleTags.includes(tag),
  );
  const tagScore =
    preferences.lifestyleTags.length > 0
      ? (matchingTags.length / preferences.lifestyleTags.length) * 100
      : 50;
  score += tagScore * 0.4;

  // Commute fit (20% weight) - check if any daily activity area matches
  let commuteScore = 50; // default neutral score
  if (preferences.dailyActivityAreas.length > 0) {
    const hasMatch = preferences.dailyActivityAreas.some(
      (area) =>
        area &&
        neighbourhood.commuteNote.toLowerCase().includes(area.toLowerCase()),
    );
    commuteScore = hasMatch ? 100 : 50;
  }
  score += commuteScore * 0.2;

  return Math.round(score);
}

export function getRecommendations(
  preferences: RenterPreferences | null,
  excludeIds: number[],
): Neighbourhood[] {
  const available = NAIROBI_NEIGHBOURHOODS.filter(
    (n) => !excludeIds.includes(n.id),
  );

  if (!preferences) {
    return available;
  }

  const scored = available.map((neighbourhood) => ({
    neighbourhood,
    score: scoreNeighbourhood(neighbourhood, preferences),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.map((item) => item.neighbourhood);
}
