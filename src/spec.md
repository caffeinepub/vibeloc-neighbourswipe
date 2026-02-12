# Specification

## Summary
**Goal:** Deliver a mobile-first MVP of “VibeLoc” (product label: “NeighbourSwipe”) for swipe-based neighbourhood discovery in Nairobi, with onboarding, matching, shortlist, persistence, and Internet Identity sign-in.

**Planned changes:**
- Create a mobile-first React UI shell with routing/navigation for Onboarding, Discover (swipe feed), Shortlist, and Profile/Preferences, using consistent “VibeLoc” and “NeighbourSwipe” naming.
- Implement onboarding to capture and persist preferences: monthly budget range (KES), commute preferences (primary area/direction + max commute time), and lifestyle tags; redirect to Discover on completion.
- Add Profile/Preferences screen to view/edit saved preferences and reflect changes in subsequent recommendations.
- Build a single Motoko backend actor with a seeded Nairobi neighbourhood catalog (≥10 entries) including: name, short description, typical rent band (KES), commute notes, lifestyle tags, and a static image filename reference.
- Implement backend matching logic (budget fit, commute fit, lifestyle overlap) to return a scored, ordered Discover feed excluding already swiped neighbourhoods.
- Build Tinder-like Discover experience: one card at a time with image, name, rent band (KES), description, tags, plus Like/Nope via gestures and buttons; include empty state with CTA to adjust preferences or reset swipes.
- Persist swipe decisions (like/dislike) per user and implement Shortlist listing liked neighbourhoods with ability to unlike; persist across reloads (per Principal when signed in, otherwise session/browser persistence).
- Add Internet Identity sign-in/sign-out with clear UI state; when signed in, fetch/save preferences and likes to backend without editing immutable auth hook files.
- Define and apply a coherent Nairobi/urban Kenya-themed visual design (not blue/purple) across all screens.
- Integrate generated static images served from the frontend at `frontend/public/assets/generated` (logo + placeholders) and use them in onboarding/header and neighbourhood cards.

**User-visible outcome:** Users can sign in (optional), complete onboarding, swipe through ranked Nairobi neighbourhood cards (Like/Nope), view and manage a saved shortlist, and edit preferences that change future recommendations—all in a mobile-first UI with a consistent theme and integrated static imagery.
