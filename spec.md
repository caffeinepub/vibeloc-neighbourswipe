# VibeLoc by GJilani

## Current State
The Post tab has three sub-forms: Spaces (wired to backend), Insights & Vibes (frontend-only, no persistence), and Community & Events (frontend-only, no persistence). The MatchesPage shows liked neighbourhoods but only links to space listings.

## Requested Changes (Diff)

### Add
- Backend `PulsePost` type covering both Insights & Vibes and Community & Events post categories
- `postPulse` mutation — saves a pulse post to stable storage
- `getPulsesByNeighbourhood(neighbourhood)` query — returns all pulse posts for a neighbourhood
- `getAllPulses` admin query
- `deletePulse` — caller or admin can delete
- Frontend: wire InsightsForm and CommunityForm to the new `postPulse` backend call
- Frontend: show pulse posts (Insights & Vibes + Community & Events) in the NeighbourhoodListingsPage alongside Spaces, with tab/filter switcher
- Frontend: react-query hooks `usePostPulse`, `useGetPulsesByNeighbourhood`

### Modify
- `NeighbourhoodListingsPage` — add a filter bar (All / Spaces / Insights / Community) and render pulse post cards below space listings
- `InsightsForm` and `CommunityForm` — call backend on submit instead of just showing toast

### Remove
- Nothing removed

## Implementation Plan
1. Add `PulsePost`, `PulsePostInput` types and storage to backend; add `postPulse`, `getPulsesByNeighbourhood`, `getAllPulses`, `deletePulse` functions
2. Regenerate frontend bindings
3. Add `usePostPulse` and `useGetPulsesByNeighbourhood` hooks
4. Wire InsightsForm and CommunityForm to `usePostPulse`
5. Update NeighbourhoodListingsPage to fetch and display pulse posts with filter tabs
