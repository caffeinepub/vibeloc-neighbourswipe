import type { Neighbourhood } from "../types/neighbourhood";

export const NAIROBI_NEIGHBOURHOODS: Neighbourhood[] = [
  {
    id: 1,
    name: "Kilimani",
    description:
      "Vibrant urban hub with cafes, nightlife, and modern apartments. Perfect for young professionals.",
    vibeSummary:
      "Where the city buzzes loudest — rooftop bars, art cafes, and Friday nights that last till sunrise.",
    rentMin: 25000,
    rentMax: 60000,
    commuteNote: "15 min to Westlands, 20 min to CBD",
    tags: ["nightlife", "cafes", "modern", "central", "shopping"],
    imageFilename: "neighbourhood-kilimani.dim_1080x1350.jpg",
    lat: -1.2921,
    lng: 36.7835,
    landmarks: ["Yaya Centre", "Junction Mall", "Kilimani Primary School"],
    transportOptions: [
      "Matatu routes 23, 48",
      "Easy access to Ngong Road",
      "15 min walk to Westlands",
    ],
  },
  {
    id: 2,
    name: "Westlands",
    description:
      "Business district with excellent amenities, restaurants, and entertainment. Great connectivity.",
    vibeSummary:
      "Nairobi's beating commercial heart — deals get done by day, dinner dates happen by night.",
    rentMin: 30000,
    rentMax: 80000,
    commuteNote: "10 min to CBD, near major offices",
    tags: ["business", "restaurants", "entertainment", "upscale", "central"],
    imageFilename: "neighbourhood-westlands.dim_1080x1350.jpg",
    lat: -1.2641,
    lng: 36.8003,
    landmarks: ["Sarit Centre", "Westgate Mall", "Delta Corner Tower"],
    transportOptions: [
      "Matatu terminus at Westlands stage",
      "Multiple CBD routes",
      "Near Waiyaki Way",
    ],
  },
  {
    id: 3,
    name: "Ngong Road",
    description:
      "Affordable and accessible with good public transport. Mix of residential and commercial.",
    vibeSummary:
      "The people's corridor — always in motion, always affordable, always connected.",
    rentMin: 15000,
    rentMax: 35000,
    commuteNote: "25 min to CBD, excellent matatu routes",
    tags: [
      "affordable",
      "transport",
      "residential",
      "local-markets",
      "community",
    ],
    imageFilename: "neighbourhood-ngong-road.dim_1080x1350.jpg",
    lat: -1.303,
    lng: 36.763,
    landmarks: ["Prestige Plaza", "Galleria Mall", "Karen Hospital"],
    transportOptions: [
      "Matatu routes 111, 126",
      "Easy CBD access",
      "Near Southern Bypass",
    ],
  },
  {
    id: 4,
    name: "Lavington",
    description:
      "Quiet, leafy suburb with spacious homes. Family-friendly with good schools nearby.",
    vibeSummary:
      "Shaded lanes, birdsong mornings, and enough space for the kids to actually run.",
    rentMin: 40000,
    rentMax: 100000,
    commuteNote: "20 min to Westlands, 30 min to CBD",
    tags: ["quiet", "family-friendly", "spacious", "green", "schools"],
    imageFilename: "neighbourhood-lavington.dim_1080x1350.jpg",
    lat: -1.2857,
    lng: 36.772,
    landmarks: ["Lavington Mall", "Valley Arcade", "Lavington Green School"],
    transportOptions: [
      "Matatu routes 23, 48",
      "Quiet estate roads",
      "20 min to Westlands",
    ],
  },
  {
    id: 5,
    name: "Parklands",
    description:
      "Diverse community with great food scene and cultural mix. Affordable and lively.",
    vibeSummary:
      "A melting pot of flavours, faiths, and faces — every street tells a different story.",
    rentMin: 20000,
    rentMax: 45000,
    commuteNote: "15 min to Westlands, 25 min to CBD",
    tags: ["diverse", "food", "cultural", "affordable", "community"],
    imageFilename: "neighbourhood-parklands.dim_1080x1350.jpg",
    lat: -1.2597,
    lng: 36.8197,
    landmarks: [
      "Parklands Sports Club",
      "Aga Khan Hospital",
      "MP Shah Hospital",
    ],
    transportOptions: [
      "Matatu routes 145, 106",
      "Near Limuru Road",
      "15 min to CBD",
    ],
  },
  {
    id: 6,
    name: "Kileleshwa",
    description:
      "Upscale residential area with modern apartments and good security. Close to amenities.",
    vibeSummary:
      "Quiet money, smart apartments, and a lifestyle that feels effortlessly put-together.",
    rentMin: 35000,
    rentMax: 75000,
    commuteNote: "15 min to Westlands, 20 min to CBD",
    tags: ["upscale", "secure", "modern", "quiet", "amenities"],
    imageFilename: "neighbourhood-kileleshwa.dim_1080x1350.jpg",
    lat: -1.2781,
    lng: 36.7838,
    landmarks: [
      "Kileleshwa Police Station",
      "Ole Sereni Hotel area",
      "Argwings Kodhek Road",
    ],
    transportOptions: [
      "Matatu routes 23, 48",
      "Easy Ngong Road access",
      "Near Westlands link roads",
    ],
  },
  {
    id: 7,
    name: "South B",
    description:
      "Established neighborhood with good infrastructure. Mix of apartments and standalone houses.",
    vibeSummary:
      "Old-school Nairobi charm with solid bones — your neighbours know your name here.",
    rentMin: 18000,
    rentMax: 40000,
    commuteNote: "20 min to CBD, near airport",
    tags: [
      "established",
      "infrastructure",
      "residential",
      "transport",
      "schools",
    ],
    imageFilename: "neighbourhood-south-b.dim_1080x1350.jpg",
    lat: -1.3117,
    lng: 36.8332,
    landmarks: [
      "South B Shopping Centre",
      "Mater Hospital",
      "Nairobi West Hospital",
    ],
    transportOptions: [
      "Matatu routes 15, 33",
      "Near Mombasa Road",
      "Airport Expressway access",
    ],
  },
  {
    id: 8,
    name: "Kasarani",
    description:
      "Growing area with affordable housing and improving amenities. Good for budget-conscious renters.",
    vibeSummary:
      "A neighbourhood on the rise — budget-friendly today, full of potential tomorrow.",
    rentMin: 12000,
    rentMax: 30000,
    commuteNote: "35 min to CBD, Thika Road access",
    tags: ["affordable", "growing", "spacious", "community", "budget-friendly"],
    imageFilename: "neighbourhood-kasarani.dim_1080x1350.jpg",
    lat: -1.2163,
    lng: 36.8948,
    landmarks: [
      "Kasarani Stadium",
      "Thika Road Mall (TRM)",
      "Safari Park Hotel",
    ],
    transportOptions: [
      "Matatu routes along Thika Road",
      "Easy CBD access via Thika Superhighway",
      "Near Roysambu",
    ],
  },
  {
    id: 9,
    name: "Upperhill",
    description:
      "Modern business district with high-rise apartments. Walking distance to hospitals and offices.",
    vibeSummary:
      "Skyline views, hospital halls, and boardrooms — for those who mean serious business.",
    rentMin: 35000,
    rentMax: 90000,
    commuteNote: "10 min to CBD, walkable to many offices",
    tags: ["modern", "business", "central", "hospitals", "high-rise"],
    imageFilename: "neighbourhood-upperhill.dim_1080x1350.jpg",
    lat: -1.2978,
    lng: 36.813,
    landmarks: [
      "Kenyatta National Hospital",
      "Bishops Road offices",
      "UAP Tower",
    ],
    transportOptions: [
      "Walking distance to CBD",
      "Matatu routes 23, 34",
      "Near Ngong Road",
    ],
  },
  {
    id: 10,
    name: "Ruaka",
    description:
      "Fast-growing suburb with new developments. Good value for space, popular with young families.",
    vibeSummary:
      "Fresh estates, young energy, and more space for your money than anywhere near the city.",
    rentMin: 18000,
    rentMax: 45000,
    commuteNote: "30 min to Westlands, 40 min to CBD",
    tags: [
      "growing",
      "spacious",
      "value",
      "family-friendly",
      "new-developments",
    ],
    imageFilename: "neighbourhood-ruaka.dim_1080x1350.jpg",
    lat: -1.2115,
    lng: 36.7568,
    landmarks: ["Ruaka Town Centre", "Two Rivers Mall", "Runda Estate"],
    transportOptions: [
      "Matatu to Westlands 30 min",
      "Limuru Road access",
      "Near Northern Bypass",
    ],
  },
  {
    id: 11,
    name: "Langata",
    description:
      "Serene area near national park. Great for nature lovers seeking peace close to the city.",
    vibeSummary:
      "Lions at your back fence, Nairobi in front — urban life meets untamed wilderness.",
    rentMin: 25000,
    rentMax: 60000,
    commuteNote: "30 min to CBD, near Nairobi National Park",
    tags: ["nature", "quiet", "green", "spacious", "peaceful"],
    imageFilename: "neighbourhood-langata.dim_1080x1350.jpg",
    lat: -1.3601,
    lng: 36.7374,
    landmarks: [
      "Nairobi National Park",
      "Bomas of Kenya",
      "Karen Blixen Museum",
    ],
    transportOptions: [
      "Matatu routes 126, 111",
      "Near Lang'ata Road",
      "30 min to CBD",
    ],
  },
  {
    id: 12,
    name: "Embakasi",
    description:
      "Industrial and residential mix with affordable options. Near airport and industrial area.",
    vibeSummary:
      "Gritty, hustling, and proudly unfiltered — the real engine room of Nairobi's economy.",
    rentMin: 10000,
    rentMax: 25000,
    commuteNote: "25 min to CBD, near airport",
    tags: [
      "affordable",
      "industrial",
      "airport",
      "budget-friendly",
      "transport",
    ],
    imageFilename: "neighbourhood-embakasi.dim_1080x1350.jpg",
    lat: -1.3211,
    lng: 36.881,
    landmarks: ["JKIA Airport", "Jomo Kenyatta Sports Ground", "Pipeline area"],
    transportOptions: [
      "Matatu routes along Mombasa Road",
      "Airport proximity",
      "Eastern Bypass access",
    ],
  },
  {
    id: 13,
    name: "Kitengela",
    description:
      "Fast-growing commuter town in Kajiado with affordable housing and new estates. Family-friendly with strong transport links.",
    vibeSummary:
      "Savanna edge living — space, sunsets, and affordable acres for the whole family.",
    rentMin: 8000,
    rentMax: 25000,
    commuteNote: "50 min to CBD via Namanga Road",
    tags: [
      "affordable",
      "growing",
      "family-friendly",
      "new-developments",
      "budget-friendly",
    ],
    imageFilename: "neighbourhood-kitengela.dim_1080x1350.jpg",
    lat: -1.475,
    lng: 36.9605,
    landmarks: [
      "Kitengela Glass Market",
      "Atlanta Shopping Mall",
      "Athi River area",
    ],
    transportOptions: [
      "Matatus to CBD via Namanga Road",
      "SGR station nearby",
      "50 min to Nairobi CBD",
    ],
  },
  {
    id: 14,
    name: "Kiambu Region",
    description:
      "Close to Nairobi, greener and quieter with mix of modern apartments and older suburbs. Popular with young professionals.",
    vibeSummary:
      "Cool highland air, coffee farm views, and a pace of life that lets you actually breathe.",
    rentMin: 15000,
    rentMax: 40000,
    commuteNote: "35 min to CBD, 25 min to Westlands",
    tags: ["green", "quiet", "modern", "affordable", "community"],
    imageFilename: "neighbourhood-kiambu.dim_1080x1350.jpg",
    lat: -1.1712,
    lng: 36.8355,
    landmarks: ["Kiambu Town", "Thika Superhighway", "Coffee farms area"],
    transportOptions: [
      "Matatu routes on Kiambu Road",
      "35 min to CBD",
      "25 min to Westlands",
    ],
  },
  {
    id: 15,
    name: "Thika",
    description:
      "Larger town with solid infrastructure and affordable rentals. Good access via Thika Superhighway with strong commercial activity.",
    vibeSummary:
      "Industrial hustle meets small-town warmth — a town that works hard and lives well.",
    rentMin: 10000,
    rentMax: 30000,
    commuteNote: "45 min to CBD via Thika Superhighway",
    tags: [
      "affordable",
      "infrastructure",
      "commercial",
      "transport",
      "growing",
    ],
    imageFilename: "neighbourhood-thika.dim_1080x1350.jpg",
    lat: -1.0332,
    lng: 37.0693,
    landmarks: ["Thika Sports Club", "Blue Posts Hotel", "Thika Town Centre"],
    transportOptions: [
      "SGR station in Thika",
      "Thika Superhighway 45 min to CBD",
      "Numerous matatu routes",
    ],
  },
  {
    id: 16,
    name: "Eastlands (Umoja, Donholm, Buruburu)",
    description:
      "Densely populated with vibrant local culture and convenient transport. Lots of commercial spots and markets.",
    vibeSummary:
      "The soul of Nairobi — loud, proud, and full of life from the first matatu to the last nyama choma.",
    rentMin: 12000,
    rentMax: 35000,
    commuteNote: "25 min to CBD, excellent matatu routes",
    tags: ["vibrant", "cultural", "transport", "local-markets", "affordable"],
    imageFilename: "neighbourhood-eastlands.dim_1080x1350.jpg",
    lat: -1.2919,
    lng: 36.8682,
    landmarks: [
      "Eastleigh Shopping District",
      "Tuskys Buruburu",
      "Uhuru Market",
    ],
    transportOptions: [
      "Dense matatu network",
      "Easy CBD access 25 min",
      "Jogoo Road routes",
    ],
  },
  {
    id: 17,
    name: "Ruai",
    description:
      "Emerging low-density area with affordable land and expanding infrastructure. Attracting first-time homeowners.",
    vibeSummary:
      "Wide open plots and fresh starts — where Nairobi's next generation is planting roots.",
    rentMin: 8000,
    rentMax: 20000,
    commuteNote: "40 min to CBD via Eastern Bypass",
    tags: ["affordable", "emerging", "spacious", "budget-friendly", "growing"],
    imageFilename: "neighbourhood-ruai.dim_1080x1350.jpg",
    lat: -1.2817,
    lng: 36.9483,
    landmarks: ["Ruai Town", "Eastern Bypass junction", "Kangundo Road"],
    transportOptions: [
      "Matatu routes via Eastern Bypass",
      "40 min to CBD",
      "Near Utawala link road",
    ],
  },
  {
    id: 18,
    name: "Utawala",
    description:
      "Rapidly growing suburb along Eastern Bypass with modern estates. Good connectivity and popular with families.",
    vibeSummary:
      "New roads, new neighbours, new beginnings — Utawala is Nairobi growing up fast.",
    rentMin: 12000,
    rentMax: 30000,
    commuteNote: "35 min to CBD via Eastern Bypass",
    tags: ["growing", "modern", "family-friendly", "transport", "affordable"],
    imageFilename: "neighbourhood-utawala.dim_1080x1350.jpg",
    lat: -1.2919,
    lng: 36.95,
    landmarks: [
      "Utawala Shopping Centre",
      "Greenspan Mall area",
      "Eastern Bypass",
    ],
    transportOptions: [
      "Matatu routes via Eastern Bypass",
      "35 min to CBD",
      "Near Ruai and Embakasi",
    ],
  },
  {
    id: 19,
    name: "Syokimau",
    description:
      "Modern suburb with SGR station access and new developments. Great for commuters seeking value and convenience.",
    vibeSummary:
      "Hop on the SGR at dawn and be at your desk before Nairobi fully wakes up.",
    rentMin: 15000,
    rentMax: 35000,
    commuteNote: "30 min to CBD via SGR or Mombasa Road",
    tags: [
      "modern",
      "transport",
      "value",
      "new-developments",
      "commuter-friendly",
    ],
    imageFilename: "neighbourhood-syokimau.dim_1080x1350.jpg",
    lat: -1.3617,
    lng: 36.8944,
    landmarks: [
      "Syokimau SGR Station",
      "Cabanas area",
      "Mombasa Road junction",
    ],
    transportOptions: [
      "SGR to CBD under 15 min",
      "Mombasa Road matatus",
      "Easy airport access",
    ],
  },
  {
    id: 20,
    name: "Athi River",
    description:
      "Industrial town with affordable housing options. Good for those working in nearby factories and EPZ.",
    vibeSummary:
      "Factory smoke at dawn, quiet evenings — practical, affordable, and closer to work than you think.",
    rentMin: 8000,
    rentMax: 22000,
    commuteNote: "45 min to CBD via Mombasa Road",
    tags: [
      "affordable",
      "industrial",
      "budget-friendly",
      "spacious",
      "growing",
    ],
    imageFilename: "neighbourhood-athi-river.dim_1080x1350.jpg",
    lat: -1.4542,
    lng: 36.9863,
    landmarks: [
      "EPZ Industrial Area",
      "Athi River Town",
      "Mavoko Municipality",
    ],
    transportOptions: [
      "SGR station",
      "Mombasa Road 45 min to CBD",
      "Matatu routes to Nairobi",
    ],
  },
  {
    id: 21,
    name: "Rongai",
    description:
      "Affordable commuter town with growing amenities and good transport links. Popular with budget-conscious renters.",
    vibeSummary:
      "Nairobi's best-kept secret — where rent is low, the air is clean, and everyone has a plot story.",
    rentMin: 10000,
    rentMax: 25000,
    commuteNote: "40 min to CBD via Magadi Road",
    tags: [
      "affordable",
      "commuter-friendly",
      "growing",
      "budget-friendly",
      "community",
    ],
    imageFilename: "neighbourhood-rongai.dim_1080x1350.jpg",
    lat: -1.3948,
    lng: 36.7512,
    landmarks: ["Rongai Town", "Nakumatt Rongai area", "Magadi Road junction"],
    transportOptions: [
      "Dedicated Rongai matatu routes 40 min",
      "Magadi Road access",
      "Near Lang'ata bypass",
    ],
  },
  {
    id: 22,
    name: "Ngong",
    description:
      "Scenic town with cooler climate and spacious properties. Great for those seeking peace and nature near the city.",
    vibeSummary:
      "Misty hills, horse trails, and a cool breeze that makes you forget you're 30km from Nairobi.",
    rentMin: 12000,
    rentMax: 35000,
    commuteNote: "45 min to CBD via Ngong Road",
    tags: ["nature", "quiet", "spacious", "green", "peaceful"],
    imageFilename: "neighbourhood-ngong.dim_1080x1350.jpg",
    lat: -1.36,
    lng: 36.66,
    landmarks: ["Ngong Hills", "Ngong Town Centre", "Maasai Market area"],
    transportOptions: [
      "Matatu routes via Ngong Road 45 min",
      "Near Ongata Rongai",
      "Southern Bypass link",
    ],
  },
  {
    id: 23,
    name: "Ruiru",
    description:
      "Fast-growing town along Thika Road with affordable housing and improving infrastructure. Good for families and commuters.",
    vibeSummary:
      "Thika Road speed meets small-town community — a smart pick for families thinking long-term.",
    rentMin: 10000,
    rentMax: 28000,
    commuteNote: "35 min to CBD via Thika Superhighway",
    tags: [
      "affordable",
      "growing",
      "family-friendly",
      "transport",
      "community",
    ],
    imageFilename: "neighbourhood-ruiru.dim_1080x1350.jpg",
    lat: -1.1446,
    lng: 36.9631,
    landmarks: ["Ruiru Town", "Ruiru Sports Club", "Thika Road junction"],
    transportOptions: [
      "Thika Superhighway 35 min to CBD",
      "Matatu routes",
      "Near Kamiti Road",
    ],
  },
  {
    id: 24,
    name: "Kamulu",
    description:
      "Emerging residential area with affordable options and expanding amenities. Good for budget-conscious families.",
    vibeSummary:
      "Off the beaten path but not off the map — Kamulu rewards those who get in early.",
    rentMin: 8000,
    rentMax: 20000,
    commuteNote: "40 min to CBD via Kangundo Road",
    tags: [
      "affordable",
      "emerging",
      "family-friendly",
      "budget-friendly",
      "spacious",
    ],
    imageFilename: "neighbourhood-kamulu.dim_1080x1350.jpg",
    lat: -1.2897,
    lng: 36.9834,
    landmarks: ["Kamulu Town", "Kangundo Road junction", "Joska Road"],
    transportOptions: [
      "Matatu routes via Kangundo Road 40 min",
      "Near Ruai",
      "Eastern Bypass access",
    ],
  },
  {
    id: 25,
    name: "Joska",
    description:
      "Quiet, low-density area with affordable land and housing. Ideal for first-time homeowners seeking space.",
    vibeSummary:
      "Quiet enough to hear yourself think, affordable enough to finally own your own space.",
    rentMin: 7000,
    rentMax: 18000,
    commuteNote: "50 min to CBD via Kangundo Road",
    tags: ["affordable", "quiet", "spacious", "budget-friendly", "emerging"],
    imageFilename: "neighbourhood-joska.dim_1080x1350.jpg",
    lat: -1.3118,
    lng: 37.05,
    landmarks: ["Joska Town", "Kangundo Road", "Machakos junction"],
    transportOptions: [
      "Matatu routes via Kangundo Road 50 min",
      "Near Athi River access",
      "Quiet residential roads",
    ],
  },
  {
    id: 26,
    name: "Kahawa West",
    description:
      "Growing residential area with good transport links and affordable housing. Popular with young professionals and families.",
    vibeSummary:
      "University energy meets neighbourhood calm — young, connected, and always on the move.",
    rentMin: 12000,
    rentMax: 30000,
    commuteNote: "30 min to CBD via Thika Road",
    tags: ["affordable", "growing", "transport", "residential", "community"],
    imageFilename: "neighbourhood-kahawa-west.dim_1080x1350.jpg",
    lat: -1.1888,
    lng: 36.9119,
    landmarks: [
      "Kenyatta University",
      "Kahawa West Shopping Centre",
      "Roysambu area",
    ],
    transportOptions: [
      "Matatu routes on Thika Road 30 min",
      "Near KU campus",
      "Easy CBD access",
    ],
  },
  {
    id: 27,
    name: "Zimmerman",
    description:
      "Established residential area with good amenities and transport. Mix of apartments and standalone houses.",
    vibeSummary:
      "Steady, reliable, and refreshingly drama-free — the neighbourhood that just works.",
    rentMin: 15000,
    rentMax: 35000,
    commuteNote: "30 min to CBD via Thika Road",
    tags: ["established", "residential", "transport", "amenities", "community"],
    imageFilename: "neighbourhood-zimmerman.dim_1080x1350.jpg",
    lat: -1.2237,
    lng: 36.892,
    landmarks: ["Zimmerman Estate", "Roysambu shops", "Thika Road access"],
    transportOptions: [
      "Matatu routes on Thika Road 30 min",
      "Near Kasarani",
      "Easy CBD link",
    ],
  },
  {
    id: 28,
    name: "Embakasi South (Pipeline, Imara Daima)",
    description:
      "Vibrant area near airport with good transport links and affordable housing. Mix of residential and commercial.",
    vibeSummary:
      "Jets overhead, matatus below — if you're always going somewhere, you'll love it here.",
    rentMin: 12000,
    rentMax: 30000,
    commuteNote: "20 min to CBD, near airport",
    tags: ["affordable", "transport", "airport", "vibrant", "commercial"],
    imageFilename: "neighbourhood-embakasi-south.dim_1080x1350.jpg",
    lat: -1.3234,
    lng: 36.8944,
    landmarks: [
      "Pipeline Shopping Centre",
      "Imara Daima SGR Station",
      "JKIA vicinity",
    ],
    transportOptions: [
      "SGR Imara Daima station",
      "Matatu routes 20 min to CBD",
      "Airport proximity",
    ],
  },
  {
    id: 29,
    name: "South C",
    description:
      "Established middle-class neighborhood with good infrastructure and amenities. Close to CBD and airport.",
    vibeSummary:
      "Middle-class Nairobi at its finest — solid, central, and close to everything that matters.",
    rentMin: 20000,
    rentMax: 50000,
    commuteNote: "15 min to CBD, near airport",
    tags: [
      "established",
      "infrastructure",
      "amenities",
      "residential",
      "central",
    ],
    imageFilename: "neighbourhood-south-c.dim_1080x1350.jpg",
    lat: -1.3092,
    lng: 36.8393,
    landmarks: [
      "South C Shopping Centre",
      "Nairobi South Hospital",
      "Bellevue Estate",
    ],
    transportOptions: [
      "Matatu routes 15 min to CBD",
      "Near Mombasa Road",
      "Airport access road",
    ],
  },
  {
    id: 30,
    name: "Tatu City",
    description:
      "Modern smart city with cutting-edge infrastructure and amenities. Planned community with schools, offices, and retail.",
    vibeSummary:
      "This is what Nairobi's future looks like — planned, connected, and built for people who think ahead.",
    rentMin: 25000,
    rentMax: 70000,
    commuteNote: "35 min to CBD via Thika Road",
    tags: [
      "modern",
      "smart-city",
      "infrastructure",
      "upscale",
      "new-developments",
    ],
    imageFilename: "neighbourhood-tatu-city.dim_1080x1350.jpg",
    lat: -1.07,
    lng: 36.963,
    landmarks: [
      "Tatu City Business Park",
      "Tatu City Schools",
      "Tatu City Retail Centre",
    ],
    transportOptions: [
      "Thika Superhighway 35 min to CBD",
      "Shuttle services",
      "Dedicated access road",
    ],
  },
  {
    id: 31,
    name: "Northlands",
    description:
      "Emerging smart city development with modern infrastructure and planned amenities. Future-focused community.",
    vibeSummary:
      "A blank canvas turning into a masterpiece — move in now before the rest of Nairobi catches on.",
    rentMin: 20000,
    rentMax: 60000,
    commuteNote: "40 min to CBD via Thika Road",
    tags: [
      "modern",
      "smart-city",
      "new-developments",
      "infrastructure",
      "growing",
    ],
    imageFilename: "neighbourhood-northlands.dim_1080x1350.jpg",
    lat: -1.055,
    lng: 37.025,
    landmarks: [
      "Northlands City development",
      "Ruiru vicinity",
      "Thika Road corridor",
    ],
    transportOptions: [
      "Thika Road 40 min to CBD",
      "Near Ruiru town",
      "Planned road network",
    ],
  },
];

export function getNeighbourhoodById(id: number): Neighbourhood | undefined {
  return NAIROBI_NEIGHBOURHOODS.find((n) => n.id === id);
}
