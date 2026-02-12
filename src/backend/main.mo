import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Option "mo:core/Option";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type OnboardingState = {
    isComplete : Bool;
  };

  public type Recommendation = {
    neighbourhood : Text;
    score : Nat;
  };

  public type ShortlistItem = {
    neighbourhoodId : Nat;
    savedAt : Time.Time;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let shortlists = Map.empty<Principal, Set.Set<Nat>>();
  let onboardingStates = Map.empty<Principal, OnboardingState>();

  // User Profile Functions (required by frontend)

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Onboarding and Preferences Functions

  public query ({ caller }) func getOnboardingState() : async OnboardingState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access onboarding state");
    };
    onboardingStates.get(caller).get(fetchDefaultOnboardingState());
  };

  public shared ({ caller }) func savePreferences(_prefs : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save preferences");
    };
    let newState : OnboardingState = {
      isComplete = true;
    };
    onboardingStates.add(caller, newState);
  };

  // Recommendation Functions

  public query ({ caller }) func getRecommendations() : async [Recommendation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get recommendations");
    };
    [];
  };

  // Shortlist Functions

  public shared ({ caller }) func shortlistNeighbourhood(neighbourhoodId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shortlist");
    };

    let existingShortlist = shortlists.get(caller);
    let shortlistSet = switch (existingShortlist) {
      case (null) { Set.empty<Nat>() };
      case (?set) { set };
    };
    shortlistSet.add(neighbourhoodId);
    shortlists.add(caller, shortlistSet);
  };

  public shared ({ caller }) func removeFromShortlist(neighbourhoodId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shortlist");
    };
    let existingShortlist = shortlists.get(caller);
    switch (existingShortlist) {
      case (null) { Runtime.trap("Shortlist is empty. ") };
      case (?shortlistSet) {
        if (not shortlistSet.contains(neighbourhoodId)) {
          Runtime.trap("Neighbourhood not in shortlist.");
        };
        shortlistSet.remove(neighbourhoodId);
        shortlists.add(caller, shortlistSet);
      };
    };
  };

  public query ({ caller }) func getShortlistedNeighbourhoods() : async [ShortlistItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shortlist");
    };
    let result = switch (shortlists.get(caller)) {
      case (null) { [] };
      case (?set) {
        set.toArray().map(func(id) { { neighbourhoodId = id; savedAt = Time.now() : Int } });
      };
    };
    result : [ShortlistItem];
  };

  public shared ({ caller }) func clearShortlist() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shortlist");
    };
    shortlists.remove(caller);
  };

  // Internal functions

  func fetchDefaultOnboardingState() : OnboardingState {
    {
      isComplete = false;
    };
  };
};
