import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    shortlists : Map.Map<Principal, Set.Set<Nat>>;
    onboardingStates : Map.Map<Principal, { isComplete : Bool }>;
    nextListingId : Nat;
    spaceListings : Map.Map<Nat, {
      id : Nat;
      title : Text;
      neighbourhood : Text;
      spaceType : Text;
      price : Nat;
      description : Text;
      postedBy : Principal;
      createdAt : Time.Time;
    }>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    shortlists : Map.Map<Principal, Set.Set<Nat>>;
    onboardingStates : Map.Map<Principal, { isComplete : Bool }>;
    nextListingId : Nat;
    nextPulseId : Nat;
    spaceListings : Map.Map<Nat, {
      id : Nat;
      title : Text;
      neighbourhood : Text;
      spaceType : Text;
      price : Nat;
      description : Text;
      postedBy : Principal;
      createdAt : Time.Time;
    }>;
    pulsePosts : Map.Map<Nat, {
      id : Nat;
      neighbourhood : Text;
      category : Text;
      postType : Text;
      title : Text;
      description : Text;
      eventDate : ?Text;
      postedBy : Principal;
      createdAt : Time.Time;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      shortlists = old.shortlists;
      onboardingStates = old.onboardingStates;
      nextListingId = old.nextListingId;
      nextPulseId = 0;
      spaceListings = old.spaceListings;
      pulsePosts = Map.empty<Nat, {
        id : Nat;
        neighbourhood : Text;
        category : Text;
        postType : Text;
        title : Text;
        description : Text;
        eventDate : ?Text;
        postedBy : Principal;
        createdAt : Time.Time;
      }>();
    };
  };
};
