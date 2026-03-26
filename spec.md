# VibeLoc — Swipe Gesture Hint Overlay

## Current State
SwipeDeck handles drag/swipe interactions but has no onboarding gesture hint. Users land on Discover and must figure out swiping on their own. The only hint is a small text label "Swipe or tap to choose".

## Requested Changes (Diff)

### Add
- `SwipeHintOverlay` component: a one-time animated overlay shown on the first card in the first Discover session
- Overlay shows a hand/finger icon animating left and right over the card with labels "PASS" (left) and "LIKE" (right)
- Auto-dismisses after ~2.5 seconds, or immediately on tap/swipe
- Uses localStorage key `vibeloc_swipe_hint_seen` to ensure it never shows again after the first time

### Modify
- `SwipeDeck.tsx`: import and render `SwipeHintOverlay` on top of the first card, only when hint hasn't been seen

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/components/discover/SwipeHintOverlay.tsx`
   - Check localStorage on mount; if already seen, render nothing
   - Show full-card overlay with animated hand icon sliding left→right→left
   - Render PASS label on left, LIKE label on right
   - Auto-dismiss via setTimeout(2500ms), also dismiss on any touch/click
   - On dismiss: set localStorage flag and unmount
2. Import and place `<SwipeHintOverlay>` inside SwipeDeck, absolutely positioned over the card, only shown when `currentIndex === 0`
