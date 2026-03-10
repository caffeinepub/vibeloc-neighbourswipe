import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Option "mo:core/Option";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Access Control
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

  public type SpaceListing = {
    id : Nat;
    title : Text;
    neighbourhood : Text;
    spaceType : Text; // "Airbnb", "Rental", "Commercial"
    price : Nat;
    description : Text;
    postedBy : Principal;
    createdAt : Time.Time;
  };

  public type SpaceListingInput = {
    title : Text;
    neighbourhood : Text;
    spaceType : Text;
    price : Nat;
    description : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let shortlists = Map.empty<Principal, Set.Set<Nat>>();
  let onboardingStates = Map.empty<Principal, OnboardingState>();
  var nextListingId : Nat = 0;
  let spaceListings = Map.empty<Nat, SpaceListing>();

  // User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    authorizeUser(caller, "Access profiles");
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    authorizeUser(caller, "Save profiles");
    userProfiles.add(caller, profile);
  };

  // Onboarding and Preferences Functions

  public query ({ caller }) func getOnboardingState() : async OnboardingState {
    authorizeUser(caller, "Access onboarding state");
    onboardingStates.get(caller).get(fetchDefaultOnboardingState());
  };

  public shared ({ caller }) func savePreferences(_prefs : Text) : async () {
    authorizeUser(caller, "Save preferences");
    onboardingStates.add(caller, { isComplete = true });
  };

  // Recommendation Functions

  public query ({ caller }) func getRecommendations() : async [Recommendation] {
    authorizeUser(caller, "Get recommendations");
    [];
  };

  // Shortlist Functions

  public shared ({ caller }) func shortlistNeighbourhood(neighbourhoodId : Nat) : async () {
    authorizeUser(caller, "Manage shortlist");
    let shortlistSet = fetchOrCreateShortlist(caller);
    shortlistSet.add(neighbourhoodId);
    shortlists.add(caller, shortlistSet);
  };

  public shared ({ caller }) func removeFromShortlist(neighbourhoodId : Nat) : async () {
    authorizeUser(caller, "Manage shortlist");
    switch (shortlists.get(caller)) {
      case (null) { Runtime.trap("Shortlist is empty."); };
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
    authorizeUser(caller, "View shortlist");
    switch (shortlists.get(caller)) {
      case (null) { ([] : [ShortlistItem]) };
      case (?set) {
        set.toArray().map(func(id) { { neighbourhoodId = id; savedAt = Time.now() } });
      };
    };
  };

  public shared ({ caller }) func clearShortlist() : async () {
    authorizeUser(caller, "Manage shortlist");
    shortlists.remove(caller);
  };

  // Space Listing Functions

  public shared ({ caller }) func postSpaceListing(input : SpaceListingInput) : async Nat {
    authorizeUser(caller, "Post space listings");
    let listingId = nextListingId;
    let newListing : SpaceListing = {
      id = listingId;
      title = input.title;
      neighbourhood = input.neighbourhood;
      spaceType = input.spaceType;
      price = input.price;
      description = input.description;
      postedBy = caller;
      createdAt = Time.now();
    };

    spaceListings.add(listingId, newListing);

    nextListingId += 1;
    listingId;
  };

  public query ({ caller }) func getListingsByNeighbourhood(neighbourhood : Text) : async [SpaceListing] {
    authorizeUser(caller, "Get listings");
    let filtered = spaceListings.values().toArray().filter(
      func(listing) { listing.neighbourhood == neighbourhood }
    );
    filtered.sort(sortListingsByCreatedAt);
  };

  public query ({ caller }) func getAllListings() : async [SpaceListing] {
    authorizeUser(caller, "Get listings");
    spaceListings.values().toArray().sort(sortListingsByCreatedAt);
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    authorizeUser(caller, "Delete listings");
    switch (spaceListings.get(id)) {
      case (null) { Runtime.trap("Listing not found"); };
      case (?listing) {
        if (listing.postedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only original poster or admin can delete");
        };
        spaceListings.remove(id);
      };
    };
  };

  // Helper Functions

  func authorizeUser(caller : Principal, _action : Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func fetchDefaultOnboardingState() : OnboardingState {
    { isComplete = false };
  };

  func fetchOrCreateShortlist(user : Principal) : Set.Set<Nat> {
    switch (shortlists.get(user)) {
      case (null) { Set.empty<Nat>() };
      case (?shortlist) { shortlist };
    };
  };

  func sortListingsByCreatedAt(a : SpaceListing, b : SpaceListing) : Order.Order {
    Int.compare(b.createdAt, a.createdAt);
  };
};

