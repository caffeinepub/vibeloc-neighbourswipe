# VibeLoc — Shareable Neighbourhood Cards

## Current State
The app has a `NeighbourhoodDetailSheet` (bottom sheet) that opens when a user taps "Learn More" on a swipe card. It shows a map, vibe summary, rent range, landmarks, transport, and tags. There is no share functionality anywhere in the app.

## Requested Changes (Diff)

### Add
- A **Share button** inside `NeighbourhoodDetailSheet`, positioned at the bottom of the panel (after the Tags section, before the bottom padding)
- Share behaviour:
  1. Use the **Web Share API** (`navigator.share`) if available (mobile, most modern browsers) — shares a title, text (neighbourhood name + vibe summary), and URL
  2. Fall back to a **copy-to-clipboard** approach if Web Share API is not available, with a toast confirmation
- The share URL should be the current page URL with a query param `?hood=<neighbourhood-slug>` (e.g. `?hood=kilimani`) so links are deep-linkable
- On app load, if the `?hood=` param is present, auto-open the detail sheet for that neighbourhood
- Share text format: `"Check out {Name} on VibeLoc — {vibeSummary}. Match your vibe 📍"`
- Share title: `"{Name} | VibeLoc by GJilani"`
- Share platforms via Web Share API: WhatsApp, Twitter/X, and any other installed share targets are handled automatically by the OS sheet
- The Share button uses a share icon (lucide `Share2`) and is styled consistently with the rest of the sheet

### Modify
- `NeighbourhoodDetailSheet.tsx` — add Share button section at the bottom
- Main app entry (App.tsx or wherever routing/URL params are read) — read `?hood=` param on load and open the correct neighbourhood detail sheet

### Remove
- Nothing removed

## Implementation Plan
1. Add a `generateShareUrl(neighbourhood)` helper that returns the current origin + `?hood=` slug
2. Add a `handleShare(neighbourhood)` function that calls `navigator.share` if available, else copies URL to clipboard and shows a toast
3. Add Share button to `NeighbourhoodDetailSheet` at the bottom of the scroll area
4. In the top-level app component, read `window.location.search` for `?hood=` param on mount; if found, find the matching neighbourhood by slug and open the detail sheet
5. The neighbourhood slug is derived from the name: lowercase, spaces replaced with hyphens (e.g. "Nairobi CBD" → "nairobi-cbd")
