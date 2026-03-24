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
export type Time = bigint;
export interface SpaceListing {
    id: bigint;
    title: string;
    postedBy: Principal;
    createdAt: Time;
    description: string;
    neighbourhood: string;
    spaceType: string;
    price: bigint;
}
export interface Recommendation {
    neighbourhood: string;
    score: bigint;
}
export interface PulsePost {
    id: bigint;
    postType: string;
    title: string;
    postedBy: Principal;
    createdAt: Time;
    description: string;
    neighbourhood: string;
    category: string;
    eventDate?: string;
}
export interface OnboardingState {
    isComplete: boolean;
}
export interface SpaceListingInput {
    title: string;
    description: string;
    neighbourhood: string;
    spaceType: string;
    price: bigint;
}
export interface UserProfile {
    name: string;
}
export interface PulsePostInput {
    postType: string;
    title: string;
    description: string;
    neighbourhood: string;
    category: string;
    eventDate?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearShortlist(): Promise<void>;
    deleteListing(id: bigint): Promise<void>;
    deletePulse(id: bigint): Promise<void>;
    getAllListings(): Promise<Array<SpaceListing>>;
    getAllPulses(): Promise<Array<PulsePost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getListingsByNeighbourhood(neighbourhood: string): Promise<Array<SpaceListing>>;
    getOnboardingState(): Promise<OnboardingState>;
    getPulsesByNeighbourhood(neighbourhood: string): Promise<Array<PulsePost>>;
    getRecommendations(): Promise<Array<Recommendation>>;
    getShortlistedNeighbourhoods(): Promise<Array<ShortlistItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postPulse(input: PulsePostInput): Promise<bigint>;
    postSpaceListing(input: SpaceListingInput): Promise<bigint>;
    removeFromShortlist(neighbourhoodId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePreferences(_prefs: string): Promise<void>;
    shortlistNeighbourhood(neighbourhoodId: bigint): Promise<void>;
}
