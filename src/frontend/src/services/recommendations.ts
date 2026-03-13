import { NAIROBI_NEIGHBOURHOODS } from "../data/neighbourhoodCatalog";
import type { Neighbourhood } from "../types/neighbourhood";
import type { RenterPreferences } from "../types/preferences";

const WORK_TYPE_BOOSTS: Record<string, string[]> = {
  Remote: ["quiet", "green", "cafes", "modern"],
  "Gig Worker": ["transport", "vibrant", "local-markets", "affordable"],
  "Formal Employment": ["business", "central", "modern"],
  Student: ["affordable", "community", "transport", "budget-friendly"],
  "Informal / Self-employed": [
    "local-markets",
    "community",
    "affordable",
    "commercial",
  ],
  "Business Owner": ["commercial", "business", "central", "upscale"],
};

function getCommuteWeight(workType: string): number {
  if (workType === "Remote") return 0.05;
  if (workType === "Formal Employment") return 0.25;
  return 0.1;
}

function getLifestyleWeight(workType: string): number {
  if (workType === "Remote") return 0.5;
  if (workType === "Student") return 0.2;
  return 0.35;
}

function getBudgetWeight(workType: string): number {
  if (workType === "Student") return 0.45;
  return 0.35;
}

function getActivityWeight(workType: string): number {
  if (workType === "Gig Worker") return 0.3;
  return 0.2;
}

export function scoreNeighbourhood(
  neighbourhood: Neighbourhood,
  preferences: RenterPreferences,
): number {
  const workType = preferences.workType || "";

  const budgetWeight = getBudgetWeight(workType);
  const lifestyleWeight = getLifestyleWeight(workType);
  const activityWeight = getActivityWeight(workType);
  const commuteWeight = getCommuteWeight(workType);

  let score = 0;

  // Budget fit
  const rentMid = (neighbourhood.rentMin + neighbourhood.rentMax) / 2;
  const budgetMid = (preferences.budgetMin + preferences.budgetMax) / 2;
  const budgetDiff = Math.abs(rentMid - budgetMid);
  const budgetScore = Math.max(0, 100 - (budgetDiff / budgetMid) * 100);
  score += budgetScore * budgetWeight;

  // Lifestyle tag overlap
  const matchingTags = neighbourhood.tags.filter((tag) =>
    preferences.lifestyleTags.includes(tag),
  );
  const tagScore =
    preferences.lifestyleTags.length > 0
      ? (matchingTags.length / preferences.lifestyleTags.length) * 100
      : 50;
  score += tagScore * lifestyleWeight;

  // Activity area proximity
  let activityScore = 50;
  if (preferences.dailyActivityAreas.length > 0) {
    const hasMatch = preferences.dailyActivityAreas.some(
      (area) =>
        area &&
        (neighbourhood.name.toLowerCase().includes(area.toLowerCase()) ||
          neighbourhood.commuteNote.toLowerCase().includes(area.toLowerCase())),
    );
    activityScore = hasMatch ? 100 : 50;
  }
  score += activityScore * activityWeight;

  // Commute / CBD proximity — parse minutes from commuteNote string
  const commuteMatch = neighbourhood.commuteNote.match(/(\d+)\s*min/);
  let commuteScore = 50;
  if (commuteMatch) {
    const mins = Number.parseInt(commuteMatch[1], 10);
    commuteScore = Math.max(0, 100 - ((mins - 10) / 50) * 100);
  }
  score += commuteScore * commuteWeight;

  // Work type tag boost
  const boostedTags = WORK_TYPE_BOOSTS[workType] || [];
  const boostMatches = neighbourhood.tags.filter((tag) =>
    boostedTags.includes(tag),
  ).length;
  score += Math.min(boostMatches * 5, 20);

  return Math.round(score);
}

export function getMatchReasons(
  neighbourhood: Neighbourhood,
  preferences: RenterPreferences,
): string[] {
  const reasons: string[] = [];
  const workType = preferences.workType || "";
  const tags = neighbourhood.tags;

  if (
    workType === "Remote" &&
    tags.some((t) => ["quiet", "green", "cafes"].includes(t))
  ) {
    reasons.push("Great for remote workers");
  }
  if (
    workType === "Gig Worker" &&
    tags.some((t) => ["transport", "vibrant"].includes(t))
  ) {
    reasons.push("Ideal for gig workers");
  }
  if (
    workType === "Student" &&
    tags.some((t) => ["affordable", "community"].includes(t))
  ) {
    reasons.push("Student-friendly area");
  }
  if (
    workType === "Business Owner" &&
    tags.some((t) => ["commercial", "central"].includes(t))
  ) {
    reasons.push("Business-ready location");
  }

  const activityMatch =
    preferences.dailyActivityAreas.length > 0 &&
    preferences.dailyActivityAreas.some(
      (area) =>
        area &&
        (neighbourhood.name.toLowerCase().includes(area.toLowerCase()) ||
          neighbourhood.commuteNote.toLowerCase().includes(area.toLowerCase())),
    );
  if (activityMatch) {
    reasons.push("Near your activity areas");
  }

  const rentMid = (neighbourhood.rentMin + neighbourhood.rentMax) / 2;
  const budgetMid = (preferences.budgetMin + preferences.budgetMax) / 2;
  if (Math.abs(rentMid - budgetMid) / budgetMid < 0.2) {
    reasons.push("Fits your budget");
  }

  const matchingTags = neighbourhood.tags.filter((tag) =>
    preferences.lifestyleTags.includes(tag),
  );
  if (matchingTags.length >= 2) {
    reasons.push("Matches your lifestyle");
  }

  if (tags.includes("smart-city")) {
    reasons.push("Smart city living");
  }

  return reasons.slice(0, 2);
}

export function getScoredRecommendations(
  preferences: RenterPreferences | null,
  excludeIds: number[],
): { neighbourhood: Neighbourhood; matchReasons: string[] }[] {
  const available = NAIROBI_NEIGHBOURHOODS.filter(
    (n) => !excludeIds.includes(n.id),
  );

  if (!preferences) {
    return available.map((neighbourhood) => ({
      neighbourhood,
      matchReasons: [],
    }));
  }

  const scored = available.map((neighbourhood) => ({
    neighbourhood,
    score: scoreNeighbourhood(neighbourhood, preferences),
    matchReasons: getMatchReasons(neighbourhood, preferences),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ neighbourhood, matchReasons }) => ({
    neighbourhood,
    matchReasons,
  }));
}

export function getRecommendations(
  preferences: RenterPreferences | null,
  excludeIds: number[],
): Neighbourhood[] {
  return getScoredRecommendations(preferences, excludeIds).map(
    (item) => item.neighbourhood,
  );
}
