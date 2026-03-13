import { useActor } from "../hooks/useActor";
import {
  OnboardingCompletion,
  type RenterPreferences,
} from "../types/preferences";

const PREFERENCES_KEY = "vibeloc_preferences";
const ONBOARDING_KEY = "vibeloc_onboarding_complete";

export class PreferencesStorage {
  private actor: any;
  private isAuthenticated: boolean;

  constructor(actor: any, isAuthenticated: boolean) {
    this.actor = actor;
    this.isAuthenticated = isAuthenticated;
  }

  async getPreferences(): Promise<RenterPreferences | null> {
    if (this.isAuthenticated && this.actor) {
      try {
        const state = await this.actor.getOnboardingState();
        if (state.isComplete) {
          const stored = localStorage.getItem(PREFERENCES_KEY);
          return stored ? this.migratePreferences(JSON.parse(stored)) : null;
        }
        return null;
      } catch (error) {
        console.error("Error fetching preferences from backend:", error);
        return this.getLocalPreferences();
      }
    }
    return this.getLocalPreferences();
  }

  async savePreferences(preferences: RenterPreferences): Promise<void> {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));

    if (this.isAuthenticated && this.actor) {
      try {
        await this.actor.savePreferences(JSON.stringify(preferences));
      } catch (error) {
        console.error("Error saving preferences to backend:", error);
      }
    }
  }

  async getOnboardingComplete(): Promise<boolean> {
    if (this.isAuthenticated && this.actor) {
      try {
        const state = await this.actor.getOnboardingState();
        return state.isComplete;
      } catch (error) {
        console.error("Error fetching onboarding state:", error);
        return this.getLocalOnboardingComplete();
      }
    }
    return this.getLocalOnboardingComplete();
  }

  private getLocalPreferences(): RenterPreferences | null {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? this.migratePreferences(JSON.parse(stored)) : null;
  }

  private migratePreferences(stored: any): RenterPreferences {
    // Handle backward compatibility: convert old commuteArea to dailyActivityAreas
    if (stored.commuteArea !== undefined && !stored.dailyActivityAreas) {
      const areas = stored.commuteArea
        ? stored.commuteArea
            .split(",")
            .map((a: string) => a.trim())
            .filter((a: string) => a.length > 0)
        : [];

      return {
        budgetMin: stored.budgetMin || 15000,
        budgetMax: stored.budgetMax || 50000,
        dailyActivityAreas: areas,
        commuteMaxMinutes: stored.commuteMaxMinutes || 30,
        lifestyleTags: stored.lifestyleTags || [],
        mainTransportStyle: stored.mainTransportStyle || "",
        biggestDealBreaker: stored.biggestDealBreaker || "",
        workType: stored.workType || "",
      };
    }

    // Ensure new fields have defaults if missing
    return {
      budgetMin: stored.budgetMin || 15000,
      budgetMax: stored.budgetMax || 50000,
      dailyActivityAreas: stored.dailyActivityAreas || [],
      commuteMaxMinutes: stored.commuteMaxMinutes || 30,
      lifestyleTags: stored.lifestyleTags || [],
      mainTransportStyle: stored.mainTransportStyle || "",
      biggestDealBreaker: stored.biggestDealBreaker || "",
      workType: stored.workType || "",
    };
  }

  private getLocalOnboardingComplete(): boolean {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  }

  setLocalOnboardingComplete(complete: boolean): void {
    localStorage.setItem(ONBOARDING_KEY, complete.toString());
  }
}
