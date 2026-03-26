# VibeLoc by GJilani

## Current State
- 79 neighbourhoods across 10 zones (CBD Core, Waiyaki Way, Northern Heights, Ngong Road, Thika Road, Southern/Mombasa, Langata Belt, Eastlands, Kiambu Belt, Kajiado Belt) + BustaniNeo Digital City
- Ruai is under Eastlands
- Tatu City is under Thika Road Corridor
- No Eastern Bypass / Kangundo Corridor zone exists
- Neighbourhood data is hardcoded in `src/frontend/src/data/neighbourhoodCatalog.ts`

## Requested Changes (Diff)

### Add
- Zone 11: Eastern Bypass / Kangundo Corridor (9 neighbourhoods): Utawala, Ruai, OJ, Tatu City, Kamakis, Membly, Kamulu, Joska, Infinity
- All neighbourhoods in this new zone with full vibe summaries, zone assignment, matching tags, rent ranges, landmarks, transport

### Modify
- Remove Ruai from Eastlands → move to Eastern Bypass zone
- Remove Tatu City from Thika Road Corridor → move to Eastern Bypass zone
- Eastlands goes from 8 → 7 neighbourhoods
- Thika Road goes from 13 → 12 neighbourhoods
- Zone filter tabs in DiscoverPage to include new Eastern Bypass zone tab
- Profile setup activity areas to include Eastern Bypass zone grouping
- Recommendations service to recognize new zone

### Remove
- All old/previous hardcoded neighbourhood data that predates the 11-zone system (replace entirely with the full corrected 86-neighbourhood dataset)

## Implementation Plan

1. Replace entire neighbourhood catalog in `neighbourhoodCatalog.ts` with the full corrected 86-neighbourhood dataset across 11 zones + BustaniNeo
2. Update zone definitions/constants to include Eastern Bypass / Kangundo Corridor
3. Update DiscoverPage zone filter tabs to include new zone
4. Update profile preferences activity area groupings to include new zone
5. Ensure recommendations service handles the new zone
6. Validate and build

### Full 86-Neighbourhood Dataset

**Zone: CBD Core (5)**
- Nairobi CBD: The pulse of the city — government, banking, retail, and hustle converging in one dense grid.
- Ngara: Student energy meets residential calm — walkable to the CBD, affordable, and quietly vibrant.
- Pangani: A neighbourhood in transition — old Nairobi bones meeting new development.
- Eastleigh: The most commercially dense zone outside the CBD. A Somali-driven business powerhouse.
- Upper Hill: Glass towers and corporate corridors. Nairobi's financial and diplomatic district.

**Zone: Waiyaki Way Corridor (9)**
- Westlands: Nairobi's cosmopolitan heartbeat — corporate offices, rooftop bars, international restaurants.
- Spring Valley: Quiet, leafy, and deliberately low-key. Diplomatic residences and executive homes.
- Loresho: Elevated living on the ridge — spacious plots, old-money calm, sweeping city views.
- Kangemi: Nairobi's working-class backbone along Waiyaki Way — dense, affordable, deeply connected.
- Mountain View: Mid-range and upwardly mobile — transitional neighbourhood with easy highway access.
- Uthiru: Affordable, expanding, and student-friendly. Close to universities and local markets.
- Kinoo: A fast-growing satellite along the corridor — family homes, local retail, community feel.
- Kikuyu: Town energy meets suburban calm — historic commercial hub with markets and transit links.
- Regen: Raw and emerging — outer edge of the corridor where land is accessible.

**Zone: Northern Heights / Limuru Road (6)**
- Parklands: Urban energy with cultural depth — diverse, walkable, Asian heritage meets creative class.
- Muthaiga: Old Nairobi at its most composed — elite, tree-lined, quiet. Embassies and colonial-era homes.
- Gigiri: Nairobi's diplomatic heartbeat — UN complex, international schools, embassies.
- Rosslyn: The lifestyle corridor of the north — quality restaurants, specialty retail, health clubs.
- Runda: Gated, green, and quietly powerful. Nairobi's most established suburban address.
- Ruaka: Youth-coded and moving fast — affordable apartments, young professionals, buzzing local scene.

**Zone: Ngong Road Corridor (8)**
- Kilimani: Nairobi's most liveable middle — apartments, cafes, gyms, walkable streets.
- Hurlingham: Professional and purposeful — medical facilities, offices, quiet residential character.
- Kileleshwa: Tree-lined, calm, and quietly aspirational. Embassies and mid-to-high end apartments.
- Lavington: Established, leafy, and family-first. Large plots, international schools.
- Adams Arcade: The practical heartbeat of the corridor — local retail, matatu terminus, mixed residential.
- Riruta: Affordable, dense, and community-driven. Working-class with strong local identity.
- Kawangware: One of Nairobi's most populous — high density, entrepreneurial spirit, community energy.
- Karen: Nairobi's garden suburb — wide roads, colonial-era homes, boutique malls.

**Zone: Thika Road Corridor (12)**
- Roasters: A compact, energetic node along the early stretch of Thika Road — local eateries and street-level hustle.
- Ngumba Estate: Quiet, established residential pocket — middle-income families, good schools nearby.
- Roysambu: Young, loud, and unapologetically alive — students, nightlife, affordable rentals.
- Zimmerman: Dense, affordable, and deeply residential — workhorse neighbourhood for working Nairobi.
- Kasarani: Sports complexes, universities, and a growing commercial strip — youth energy meets infrastructure.
- Githurai: One of Nairobi's busiest transit and commercial hubs — high density, fast-paced.
- Kahawa Wendani: Student-dominated and socially rich — hub of young energy and affordable housing.
- Kahawa Sukari: The calmer, more residential sibling of Wendani — middle-income families, leafy streets.
- Northlands: Nairobi's northern frontier — master-planned, ambitious, and still taking shape.
- Ruiru: Satellite town energy with city ambitions — affordable housing estates, growing retail.
- Juja: University town with deep roots — JKUAT anchors the social and economic life.
- Witeithie: Emerging and unhurried — land is accessible, air is cleaner, community is small.
- Thika: The corridor's final destination and a city in its own right — industrial history, busy town centre.

**Zone: Southern / Mombasa Road (7)**
- South C: One of Nairobi's most established middle-class addresses — well-planned streets, strong community identity.
- South B: Denser, more affordable, deeply local. Long-term residents and deep community ties.
- Industrial Area: Nairobi's manufacturing and logistics backbone — warehouses, factories, supply chains 24/7.
- Imara Daima: Quietly on the rise — mid-range residential zone with modern apartments, easy SGR access.
- Embakasi: Dense, connected, close to JKIA — high-energy residential and commercial zone.
- Syokimau: The SGR effect in action — booming with modern estates, young homeowners, commuters.
- Mlolongo: Nairobi's southern gateway — affordable, expanding, expressway access.

**Zone: Langata Belt (6)**
- Madaraka Estate: Institutional roots and residential character — well-connected, stable, families and professionals.
- Dam Estate: Green space, the dam, and a slower urban pace — nature and neighbourhood life coexist.
- Otiende: Grounded and well-worn — a working-family neighbourhood with deep roots.
- Onyonka: Residential, familiar, and tight-knit — mid-density with neighbourhood feel.
- Ngei: School-anchored and family-first — quiet streets, established homes.
- Langata: The corridor's anchor — middle-income families, proximity to Nairobi National Park.

**Zone: Eastlands (7 — Ruai moved to Eastern Bypass)**
- Kariobangi: One of Nairobi's oldest planned estates — dense, industrious, community-driven.
- Dandora: Raw, creative, and unfiltered — cultural powerhouse, high density, strong identity.
- Buruburu: Eastlands' most established middle-class address — well-planned phases, tree-lined roads.
- Donholm: Calm, orderly, and family-oriented — polished end of Eastlands.
- Umoja: One of the most populated estates in Nairobi — a city within a city.
- Kayole: Densely wired and economically active — busy markets, packed matatu routes.
- Komarock: Planned, green, and quietly aspirational — better-infrastructure estates in Eastlands.
- Fedha Estate: Compact, tidy, and well-connected — quiet middle-income pride.

Wait — that's 8 for Eastlands. Let me recount. Ruai is moved out, so: Kariobangi, Dandora, Buruburu, Donholm, Umoja, Kayole, Komarock, Fedha Estate = 8 (Ruai was never one of these — in previous iteration Ruai was the one added, so Eastlands stays at these 8 minus Ruai if Ruai was there). Actually from the conversation: original Eastlands had Kariobangi, Dandora, Buruburu, Donholm, Umoja, Kayole, Komarock, Fedha Estate (8 confirmed by user). Ruai was in an *earlier* older list. The user-confirmed 8 for Eastlands zone doesn't include Ruai, so Eastlands stays at 8. Ruai is added to Eastern Bypass as a new entry.

**Zone: Kiambu Belt (11)**
- Wangige: A busy market town — fresh produce, local trade, community that wakes early and works hard.
- Kingeero: Quiet, green, and unhurried — residential pocket between Wangige and the city.
- Gachie: Transitional and growing fast — affordable land, improving infrastructure.
- Kiambu Town: The administrative heart of the belt — government offices, courts, markets.
- Kirigiti: Low-key and residential — Kirigiti Sports Complex, calm neighbourhood character.
- Thindigua: Northern Bypass effect in full swing — gated estates, apartments, young professionals.
- Ridgeways: Elevated, leafy, and aspirational — premium residential, well-maintained roads.
- Marurui: Affordable and community-rooted — working residential between the bypass and Kiambu-edge estates.
- Garden Estate: Nairobi's original garden suburb feel outside the south — spacious plots, mature trees.
- Thome: Mid-density and family-oriented — grown organically, school presence, local shops.
- Kahawa West: Student energy and affordable residential — proximity to universities, young residents.

**Zone: Kajiado / Kitengela Belt (5)**
- Kitengela: Nairobi's southern pressure valve — affordable land, growing estates, family-driven.
- Ongata Rongai: The commuter town that became a lifestyle choice — full community with its own identity.
- Kiserian: Quiet, semi-rural, and intentionally unhurried — land, clean air, slower pace.
- Ngong: Hilltop views, cool air — Maasai heritage, gateway to Great Rift Valley.
- Isinya: The frontier edge of the belt — open land, emerging developments, early movers.

**Zone: Eastern Bypass / Kangundo (9)**
- Utawala: The bypass's residential frontline — gated estates, young families, growing commercial strip.
- Ruai: Eastern bypass energy meets affordable residential life — transitional zone, first-time buyer opportunities.
- OJ: The connector node between Tatu City and Ruiru — logistics, commuter traffic, new residential.
- Tatu City: Nairobi's most ambitious urban project — master-planned smart city with its own infrastructure.
- Kamakis: Strategic and on the rise — Eastern Bypass meets Kangundo Road, logistics and residential hub.
- Membly: Quiet and residential with room to grow — space and bypass access without the premium.
- Kamulu: Affordable, green, increasingly connected — semi-rural, early movers, land and clean air.
- Joska: The outer corridor's emerging frontier — open plots, affordable housing, early-stage energy.
- Infinity: Fast-developing estate node along Kangundo Road — modern housing, young homeowners.

**Zone: Digital City (1)**
- BustaniNeo: A digital city for creative rebels — decentralized, community-first, Dewellpunk-powered. Where BustaniNeo exists, geography is optional.
