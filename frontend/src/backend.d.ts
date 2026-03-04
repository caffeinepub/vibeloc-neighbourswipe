import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShortlistItem {
    savedAt: Time;
    neighbourhoodId: bigint;
}
export interface Recommendation {
    neighbourhood: string;
    score: bigint;
}
export type Time = bigint;
export interface OnboardingState {
    isComplete: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearShortlist(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOnboardingState(): Promise<OnboardingState>;
    getRecommendations(): Promise<Array<Recommendation>>;
    getShortlistedNeighbourhoods(): Promise<Array<ShortlistItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromShortlist(neighbourhoodId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePreferences(_prefs: string): Promise<void>;
    shortlistNeighbourhood(neighbourhoodId: bigint): Promise<void>;
}
