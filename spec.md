# Specification

## Summary
**Goal:** Expand VibeLoc’s static Nairobi-area neighbourhood catalog to include additional major Nairobi and nearby metro areas while keeping the existing data shape and ensuring uniqueness.

**Planned changes:**
- Add new Neighbourhood entries to `frontend/src/data/neighbourhoodCatalog.ts` for: Kitengela, Kiambu Region, Thika, Eastlands (e.g., Umoja/Donholm/Buruburu), Ruai, Utawala, Syokimau, Athi River, Rongai, Ngong, Ruiru, Kamulu, Joska, Kahawa West, Zimmerman, Embakasi South (e.g., Pipeline/Imara Daima), South C, Tatu City, Northlands.
- Ensure all new entries use unique numeric IDs continuing after the current highest ID (12) and have no duplicate names.
- Assign a valid `imageFilename` to each new entry (reuse the existing neighbourhood placeholder asset where needed) so the Discover swipe feed continues to render without errors.

**User-visible outcome:** The Discover swipe feed shows a larger set of Nairobi and metro neighbourhoods/areas to browse and swipe through without runtime issues.
