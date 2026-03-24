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
import Migration "migration";

(with migration = Migration.run)
actor {
  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Type Definitions
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

  public type PulsePost = {
    id : Nat;
    neighbourhood : Text;
    category : Text; // "insights" or "community"
    postType : Text;
    title : Text;
    description : Text;
    eventDate : ?Text;
    postedBy : Principal;
    createdAt : Time.Time;
  };

  public type PulsePostInput = {
    neighbourhood : Text;
    category : Text;
    postType : Text;
    title : Text;
    description : Text;
    eventDate : ?Text;
  };

  // Persistent Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let shortlists = Map.empty<Principal, Set.Set<Nat>>();
  let onboardingStates = Map.empty<Principal, OnboardingState>();
  var nextListingId : Nat = 0;
  var nextPulseId : Nat = 0;
  let spaceListings = Map.empty<Nat, SpaceListing>();
  let pulsePosts = Map.empty<Nat, PulsePost>();

  // User Profile Functions
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
    onboardingStates.add(caller, { isComplete = true });
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
    let shortlistSet = fetchOrCreateShortlist(caller);
    shortlistSet.add(neighbourhoodId);
    shortlists.add(caller, shortlistSet);
  };

  public shared ({ caller }) func removeFromShortlist(neighbourhoodId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shortlist");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view shortlist");
    };
    switch (shortlists.get(caller)) {
      case (null) { ([] : [ShortlistItem]) };
      case (?set) {
        set.toArray().map(
          func(id) {
            {
              neighbourhoodId = id;
              savedAt = Time.now();
            };
          }
        );
      };
    };
  };

  public shared ({ caller }) func clearShortlist() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage shortlist");
    };
    shortlists.remove(caller);
  };

  // Space Listing Functions
  public shared ({ caller }) func postSpaceListing(input : SpaceListingInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post space listings");
    };
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

  public query func getListingsByNeighbourhood(neighbourhood : Text) : async [SpaceListing] {
    // Public read access - no authorization required
    let filtered = spaceListings.values().toArray().filter(
      func(listing) { listing.neighbourhood == neighbourhood }
    );
    filtered.sort(sortListingsByCreatedAt);
  };

  public query func getAllListings() : async [SpaceListing] {
    // Public read access - no authorization required
    spaceListings.values().toArray().sort(sortListingsByCreatedAt);
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete listings");
    };
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

  // Pulse Post Functions
  public shared ({ caller }) func postPulse(input : PulsePostInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post pulses");
    };
    let pulseId = nextPulseId;
    let newPulse : PulsePost = {
      id = pulseId;
      neighbourhood = input.neighbourhood;
      category = input.category;
      postType = input.postType;
      title = input.title;
      description = input.description;
      eventDate = input.eventDate;
      postedBy = caller;
      createdAt = Time.now();
    };

    pulsePosts.add(pulseId, newPulse);

    nextPulseId += 1;
    pulseId;
  };

  public query func getPulsesByNeighbourhood(neighbourhood : Text) : async [PulsePost] {
    // Public read access - no authorization required
    let pulsesArray = pulsePosts.values().toArray();
    pulsesArray.filter(
      func(pulse) {
        Text.equal(pulse.neighbourhood, neighbourhood);
      }
    ).sort(sortPulsePostsByCreatedAt);
  };

  public query ({ caller }) func getAllPulses() : async [PulsePost] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all pulses");
    };
    pulsePosts.values().toArray().sort(sortPulsePostsByCreatedAt);
  };

  public shared ({ caller }) func deletePulse(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete pulses");
    };
    switch (pulsePosts.get(id)) {
      case (null) { Runtime.trap("Pulse not found"); };
      case (?pulse) {
        if (pulse.postedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only original poster or admin can delete");
        };
        pulsePosts.remove(id);
      };
    };
  };

  // Helper Functions
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

  func sortPulsePostsByCreatedAt(a : PulsePost, b : PulsePost) : Order.Order {
    Int.compare(b.createdAt, a.createdAt);
  };
};
