export interface RenterPreferences {
  budgetMin: number;
  budgetMax: number;
  dailyActivityAreas: string[];
  commuteMaxMinutes: number;
  lifestyleTags: string[];
  mainTransportStyle: string;
  biggestDealBreaker: string;
  workType: string;
}

export interface OnboardingCompletion {
  isComplete: boolean;
  preferences?: RenterPreferences;
}
