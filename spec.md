# VibeLoc — Pulses Tab

## Current State
The app has four main tabs: Discover, Matches, Post, Profile. There is no notification/activity feed tab. The backend already has `getAllPulses()` and `getPulsesByNeighbourhood()` APIs returning `PulsePost` objects. Users have a shortlist (matched neighbourhoods) stored via `useShortlist`.

## Requested Changes (Diff)

### Add
- New `PulsesPage` component at `/pulses` route
- A "Pulses" tab in `BottomNav` between Post and Profile, using a radio/wave icon (Zap or Activity from lucide)
- Session-based activity feed: on mount, fetch all pulses from matched neighbourhoods and display as a scrollable feed
- Three filter pills at the top: All | Insights & Vibes | Community & Events (Spaces not shown in Pulses — that's a separate listing flow)
- Each pulse card shows: neighbourhood name + zone badge, post type badge, title, description snippet, time ago, and category
- Empty state when user has no matched neighbourhoods or no pulses
- GJilani platform pulses (admin-published) as a pinned section at the top (filter: category === 'platform')

### Modify
- `BottomNav.tsx` — add Pulses nav item between Post and Profile
- `App.tsx` — add `/pulses` route

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/PulsesPage.tsx` — fetches pulses from matched neighbourhood IDs, groups into platform + neighbourhood feeds, renders with filter pills
2. Update `BottomNav.tsx` to add Pulses tab
3. Update `App.tsx` to add pulses route
