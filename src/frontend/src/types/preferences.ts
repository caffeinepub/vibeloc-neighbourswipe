export interface RenterPreferences {
  budgetMin: number;
  budgetMax: number;
  commuteArea: string;
  commuteMaxMinutes: number;
  lifestyleTags: string[];
}

export interface OnboardingCompletion {
  isComplete: boolean;
  preferences?: RenterPreferences;
}
